import { describe, expect, test } from '@jest/globals';
import { HttpClient } from '../http.client';
import { Role } from '../../../enums/user-role';

describe('get users tests', () => {
  test('Simple user should be able to get data', async () => {
    const httpClient = new HttpClient();
    await httpClient.loginAsUser();

    const activeUsers = await httpClient.getAllActiveUsers();

    const givenUser = activeUsers.find((u) => u.user_name === 'user@admin.pl');

    expect(givenUser?.user_name).toBe('user@admin.pl');
    expect(givenUser?.role).toBe(Role.User);
  });

  test('Admin should be able to get data', async () => {
    const httpClient = new HttpClient();
    await httpClient.loginAsAdmin();

    const activeUsers = await httpClient.getAllActiveUsers();

    const givenUser = activeUsers.find((u) => u.user_name === 'admin@admin.pl');

    expect(givenUser?.user_name).toBe('admin@admin.pl');
    expect(givenUser?.role).toBe(Role.Admin);
  });
});
