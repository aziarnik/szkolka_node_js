import { describe, expect, test } from '@jest/globals';
import { HttpClient } from '../http.client';
import { IntegrationTestHelpers } from '../test-helpers';
import { Consts } from '../../../consts';
import { AccessToken } from '../../../value-objects/access-token';
import { Role } from '../../../enums/user-role';
import { randomBytes } from 'crypto';

describe('New access token endpoint tests', () => {
  test('new token should be generated for user', async () => {
    const httpClient = new HttpClient();
    await httpClient.loginAsAdmin();

    const userName = `${randomBytes(10).toString('hex')}@b.pl`;
    await httpClient.registerUser({
      confirmPassword: 'password',
      password: 'password',
      userName: userName
    });

    const firstResponse = await httpClient.loginUser({
      password: 'password',
      userName: userName
    });

    const oldAccessToken = AccessToken.createWithoutVerifying(
      IntegrationTestHelpers.getAccessToken(firstResponse)
    );

    //we are waiting until accessToken will expire
    await IntegrationTestHelpers.wait(11000);
    const secondResponse = await httpClient.newAccessToken();

    console.log(secondResponse);
    const newAccessToken = AccessToken.createWithoutVerifying(
      IntegrationTestHelpers.getAccessToken(secondResponse)
    );

    const userContext = newAccessToken.getUserContext();
    expect(userContext.email).toBe(userName);
    expect(userContext.role).toBe(Role.User);
    expect(oldAccessToken.equals(newAccessToken)).toBe(false);
  }, 15000);

  test('when refresh token expires new access token should not be generated for user', async () => {
    const httpClient = new HttpClient();
    await httpClient.loginUser({
      password: 'password',
      userName: 'admin@admin.pl'
    });

    //we are waiting until refresh token will expire
    await IntegrationTestHelpers.wait(21000);
    const response = await httpClient.newAccessToken();

    expect(
      [
        Consts.REFRESH_TOKEN_EXPIRED,
        Consts.REFRESH_TOKEN_USED_OR_DELETED_BY_JOB
      ].some((x) => x === response.status)
    ).toBe(true);
  }, 22000);
});
