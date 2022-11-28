import { describe, expect, test } from '@jest/globals';
import { HttpClient } from '../http.client';
import { Role } from '../../../enums/user-role';
import { TestConsts } from '../../test-contsts';

describe('get users tests', () => {
  test('Simple user should be able to get data', async () => {
    const httpClient = new HttpClient();
    await httpClient.loginAsUser();

    const activeUsers = await httpClient.getAllActiveUsers();

    const givenUser = activeUsers.find(
      (u) => u.user_name === TestConsts.simpleUserName
    );

    expect(givenUser?.user_name).toBe(TestConsts.simpleUserName);
    expect(givenUser?.role).toBe(Role.User);
  });

  test('Admin should be able to get data', async () => {
    const httpClient = new HttpClient();
    await httpClient.loginAsAdmin();

    const activeUsers = await httpClient.getAllActiveUsers();

    const givenUser = activeUsers.find(
      (u) => u.user_name === TestConsts.adminUserName
    );

    expect(givenUser?.user_name).toBe(TestConsts.adminUserName);
    expect(givenUser?.role).toBe(Role.Admin);
  });
});
