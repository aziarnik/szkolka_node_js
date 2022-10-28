import { describe, expect, test } from '@jest/globals';
import { HttpClient } from '../http.client';
import { IntegrationTestHelpers } from '../test-helpers';
import { Consts } from '../../../consts';

describe('user should logout', () => {
  test('user should not be possible to access protected endpoint when token expires', async () => {
    const httpClient = new HttpClient();
    await httpClient.loginUser({
      password: 'password',
      userName: 'admin@admin.pl'
    });

    const firstAuthorizationHeader = httpClient.getAuthorizationHeader();

    await httpClient.logoutUser();

    //we are waiting until accessToken will expire
    await IntegrationTestHelpers.wait(11000);

    httpClient.setAuthorizationHeader(firstAuthorizationHeader);
    const response = await httpClient.getAllActiveUsersWithHttpResponse();

    expect(response.status).toBe(Consts.TOKEN_EXPIRED_RESPONSE_STATUS);
  }, 12000);
});
