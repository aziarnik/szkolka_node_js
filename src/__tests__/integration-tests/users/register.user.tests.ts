import { describe, expect, test } from '@jest/globals';
import { HttpClient } from '../http.client';
import { Role } from '../../../enums/user-role';
import { Consts } from '../../../consts';
import { randomBytes } from 'crypto';

describe('register users tests', () => {
  test('Simple user should not be able to register user', async () => {
    const httpClient = new HttpClient();
    await httpClient.loginAsUser();

    const response = await httpClient.registerUser({
      confirmPassword: 'password',
      password: 'password',
      userName: 'a@b.pl'
    });

    expect(response.status).toBe(Consts.PERMISSION_DENIED_STATUS);
  });

  test('Admin should be able to register user', async () => {
    const httpClient = new HttpClient();
    await httpClient.loginAsAdmin();

    const userName = `${randomBytes(10).toString('hex')}@b.pl`;
    await httpClient.registerUser({
      confirmPassword: 'password',
      password: 'password',
      userName: userName
    });

    const activeUsers = await httpClient.getAllActiveUsers();

    const justAddedUser = activeUsers.find((x) => x.user_name === userName);

    expect(justAddedUser?.user_name).toBe(userName);
    expect(justAddedUser?.role).toBe(Role.User);
  });
});
