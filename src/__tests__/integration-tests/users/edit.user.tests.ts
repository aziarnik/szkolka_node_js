import { describe, expect, test } from '@jest/globals';
import { HttpClient } from '../http.client';
import { Consts } from '../../../consts';
import { randomBytes } from 'crypto';
import { IntegrationTestHelpers } from '../test-helpers';
import { AccessToken } from '../../../value-objects/access-token';

describe('edit users tests', () => {
  test('Simple user not should be able to edit not himself', async () => {
    const httpClient = new HttpClient();
    await httpClient.loginAsUser();

    const activeUsers = await httpClient.getAllActiveUsers();

    const adminUser = activeUsers.find((u) => u.user_name === 'admin@admin.pl');

    const response = await httpClient.updateUser(
      adminUser?.id as number,
      [
        {
          op: 'replace',
          path: '/password',
          value: 'newPassword'
        }
      ],
      adminUser?.xmin as number
    );
    expect(response.status).toBe(Consts.PERMISSION_DENIED_STATUS);
  });

  test('Simple user should be able to edit himself', async () => {
    const httpClient = new HttpClient();
    await httpClient.loginAsAdmin();

    const userName = `${randomBytes(10).toString('hex')}@b.pl`;
    await httpClient.registerUser({
      confirmPassword: 'password',
      password: 'password',
      userName: userName
    });

    const response = await httpClient.loginUser({
      password: 'password',
      userName: userName
    });
    const accessToken = AccessToken.createWithoutVerifying(
      IntegrationTestHelpers.getAccessToken(response)
    );

    const userContext = accessToken.getUserContext();
    const updatedUserDetails = await httpClient.getUser(userContext.id);

    const updateResponse = await httpClient.updateUser(
      userContext.id,
      [{ op: 'replace', path: '/password', value: 'newPassword' }],
      updatedUserDetails.xmin
    );

    const loginResponse = await httpClient.loginUser({
      password: 'newPassword',
      userName: userName
    });

    expect(updateResponse.status).toBe(200);
    expect(loginResponse.status).toBe(200);
  });

  test('One request should not update users, when two are updating in the same time', async () => {
    const httpClient = new HttpClient();
    await httpClient.loginAsAdmin();

    const userName = `${randomBytes(10).toString('hex')}@b.pl`;
    await httpClient.registerUser({
      confirmPassword: 'password',
      password: 'password',
      userName: userName
    });

    const response = await httpClient.loginUser({
      password: 'password',
      userName: userName
    });
    const accessToken = AccessToken.createWithoutVerifying(
      IntegrationTestHelpers.getAccessToken(response)
    );

    const userContext = accessToken.getUserContext();
    const updatedUserDetails = await httpClient.getUser(userContext.id);

    const firstPatch = httpClient.updateUser(
      updatedUserDetails.id,
      [
        {
          op: 'replace',
          path: '/password',
          value: 'newPassword'
        }
      ],
      updatedUserDetails.xmin
    );

    const newUserName = `${randomBytes(10).toString('hex')}@b.pl`;
    const secondPatch = httpClient.updateUser(
      userContext.id,
      [
        {
          op: 'replace',
          path: '/user_name',
          value: newUserName
        }
      ],
      updatedUserDetails.xmin
    );

    const firstResponse = await firstPatch;
    const secondResponse = await secondPatch;

    const errorResponse = [firstResponse, secondResponse].find(
      (r) => r.status === Consts.CUSTOM_ERROR_STATUS
    );

    const okResponse = [firstResponse, secondResponse].find(
      (r) => r.status === 200
    );

    expect(errorResponse?.status).toBe(Consts.CUSTOM_ERROR_STATUS);
    expect(okResponse?.status).toBe(200);
  });

  test('user should not be able to update user, which in the meantime was edited', async () => {
    const httpClient = new HttpClient();
    await httpClient.loginAsAdmin();

    const userName = `${randomBytes(10).toString('hex')}@b.pl`;
    await httpClient.registerUser({
      confirmPassword: 'password',
      password: 'password',
      userName: userName
    });

    const response = await httpClient.loginUser({
      password: 'password',
      userName: userName
    });
    const accessToken = AccessToken.createWithoutVerifying(
      IntegrationTestHelpers.getAccessToken(response)
    );

    const userContext = accessToken.getUserContext();
    const updatedUserDetails = await httpClient.getUser(userContext.id);

    const firstPatch = await httpClient.updateUser(
      updatedUserDetails.id,
      [
        {
          op: 'replace',
          path: '/password',
          value: 'newPassword'
        }
      ],
      updatedUserDetails.xmin
    );

    const newUserName = `${randomBytes(10).toString('hex')}@b.pl`;
    const secondPatch = await httpClient.updateUser(
      userContext.id,
      [
        {
          op: 'replace',
          path: '/user_name',
          value: newUserName
        }
      ],
      updatedUserDetails.xmin
    );

    expect(firstPatch.status).toBe(200);
    expect(secondPatch.status).toBe(Consts.CUSTOM_ERROR_STATUS);
  });
});
