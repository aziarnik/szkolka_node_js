import { describe, expect, test } from '@jest/globals';
import { HttpClient } from '../http.client';
import { Consts } from '../../../consts';
import { AccessToken } from '../../../value-objects/access-token';
import { Role } from '../../../enums/user-role';
import { IntegrationTestHelpers } from '../test-helpers';
import { randomBytes } from 'crypto';

describe('login tests', () => {
  test('Admin user should login', async () => {
    const httpClient = new HttpClient();
    const response = await httpClient.loginUser({
      password: 'password',
      userName: 'admin@admin.pl'
    });

    const accessToken = AccessToken.createWithoutVerifying(
      IntegrationTestHelpers.getAccessToken(response)
    );

    const userContext = accessToken.getUserContext();
    expect(userContext.email).toBe('admin@admin.pl');
    expect(userContext.role).toBe(Role.Admin);
  });

  test('Inactive user should not login', async () => {
    const httpClient = new HttpClient();
    const httpResponse = await httpClient.loginUser({
      password: 'password',
      userName: 'deletedUser@admin.pl'
    });

    expect(httpResponse.status).toBe(Consts.CUSTOM_ERROR_STATUS);
  });

  test.each([
    ['password1'],
    ['password12'],
    ['iufhewoifuhe'],
    ['1password1'],
    ['1password'],
    [`${randomBytes(10).toString('hex')}cde`],
    [`${randomBytes(10).toString('hex')}abc`]
  ])(
    'User with wrong password typed should not have access to application',
    async (password: string) => {
      const httpClient = new HttpClient();
      const response = await httpClient.loginUser({
        password: password,
        userName: 'admin@admin.pl'
      });

      expect(response.status).toBe(400);
    }
  );
});
