import { describe, expect, test } from '@jest/globals';
import { HttpClient } from '../http.client';
import { Consts } from '../../../consts';
import { randomBytes } from 'crypto';
import { IntegrationTestHelpers } from '../test-helpers';
import { AccessToken } from '../../../value-objects/access-token';
import { TestConsts } from '../../test-contsts';

describe('delete user tests', () => {
  test('Simple user should not be able to delete not himself', async () => {
    const httpClient = new HttpClient();
    await httpClient.loginAsUser();

    const activeUsers = await httpClient.getAllActiveUsers();

    const adminUser = activeUsers.find(
      (u) => u.user_name === TestConsts.adminUserName
    );

    const response = await httpClient.deleteUser(adminUser?.id as number);
    expect(response.status).toBe(Consts.PERMISSION_DENIED_STATUS);
  });

  test('Simple user should be able to delete himself', async () => {
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
    const deleteResponse = await httpClient.deleteUser(userContext.id);

    await httpClient.loginAsAdmin();
    const activeUsers = await httpClient.getAllActiveUsers();

    const deletedUser = activeUsers.find((x) => x.user_name === userName);

    expect(deleteResponse.status).toBe(200);
    expect(deletedUser).toBe(undefined);
  });

  test('Admin should be able to delete any user', async () => {
    const httpClient = new HttpClient();
    await httpClient.loginAsAdmin();

    const userName = `${randomBytes(10).toString('hex')}@b.pl`;
    await httpClient.registerUser({
      confirmPassword: 'password',
      password: 'password',
      userName: userName
    });

    const firstActiveUsers = await httpClient.getAllActiveUsers();
    const firstTimeDeletedUser = firstActiveUsers.find(
      (x) => x.user_name === userName
    );

    const deleteResponse = await httpClient.deleteUser(
      firstTimeDeletedUser?.id as number
    );

    const secondActiveUsers = await httpClient.getAllActiveUsers();

    const secondTimeDeletedUser = secondActiveUsers.find(
      (x) => x.user_name === userName
    );

    expect(deleteResponse.status).toBe(200);
    expect(secondTimeDeletedUser).toBe(undefined);
  });
});
