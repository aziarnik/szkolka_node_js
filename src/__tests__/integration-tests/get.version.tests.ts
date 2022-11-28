import { describe, expect, test } from '@jest/globals';
import { HttpClient } from './http.client';

describe('get version tests', () => {
  test('anonymous access should be provided', async () => {
    const httpClient = new HttpClient();
    const response = await httpClient.getVersionWithHttpResponse();

    expect(response.status).toBe(200);
  });
});
