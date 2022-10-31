import { describe, expect, test } from '@jest/globals';
import { HttpClient } from '../http.client';
import { Role } from '../../../enums/user-role';
import { TestConsts } from '../../test-contsts';

describe('get user by id tests', () => {
  test('Simple user should be able to get user data', async () => {
    const httpClient = new HttpClient();
    await httpClient.loginAsUser();

    const activeUsers = await httpClient.getAllActiveUsers();

    const givenUser = activeUsers.find(
      (u) => u.user_name === TestConsts.simpleUserName
    );

    const response = await httpClient.getUser(givenUser?.id as number);

    expect(response?.user_name).toBe(TestConsts.simpleUserName);
    expect(response?.role).toBe(Role.User);
    expect(response.id).toBe(givenUser?.id);
  });

  test('Admin should be able to get user data', async () => {
    const httpClient = new HttpClient();
    await httpClient.loginAsAdmin();

    const activeUsers = await httpClient.getAllActiveUsers();

    const givenUser = activeUsers.find(
      (u) => u.user_name === TestConsts.adminUserName
    );

    const response = await httpClient.getUser(givenUser?.id as number);

    expect(response?.user_name).toBe(TestConsts.adminUserName);
    expect(response?.role).toBe(Role.Admin);
    expect(response.id).toBe(givenUser?.id);
  });
});
