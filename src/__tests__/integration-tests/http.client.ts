import { Operation } from 'fast-json-patch';
import { LoginDto } from '../../contracts/auth/login-dto';
import { GetUserDto } from '../../contracts/user/get-user-dto';
import { RegisterDto } from '../../contracts/auth/register-dto';
import { ProjectBasicInfo } from '../../contracts/project-basic-info';
import fetch from 'cross-fetch';
import { TestConsts } from '../test-contsts';
import { Consts } from '../../consts';

export class HttpClient {
  private static baseUrl = `http://localhost:6000`;
  private authorizationHeader = '';

  setAuthorizationHeader(accessToken: string) {
    this.authorizationHeader = accessToken;
  }

  getAuthorizationHeader() {
    return this.authorizationHeader;
  }

  async loginAsAdmin(): Promise<Response> {
    return await this.loginUser({
      password: TestConsts.adminUserPassword,
      userName: TestConsts.adminUserName
    });
  }

  async loginAsUser(): Promise<Response> {
    return await this.loginUser({
      password: TestConsts.simpleUserPassword,
      userName: TestConsts.simpleUserName
    });
  }

  async loginUser(loginDto: LoginDto): Promise<Response> {
    const response = await fetch(`${HttpClient.baseUrl}/auth/login`, {
      method: 'POST',
      body: JSON.stringify(loginDto),
      headers: { 'Content-Type': 'application/json' }
    });

    this.authorizationHeader = response.headers.get('Authorization') as string;
    return response;
  }

  async logoutUser(): Promise<Response> {
    const response = await fetch(`${HttpClient.baseUrl}/auth/logout`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: this.authorizationHeader
      }
    });
    this.authorizationHeader = '';

    return response;
  }

  async newAccessToken(): Promise<Response> {
    const response = await fetch(
      `${HttpClient.baseUrl}/auth/new-access-token`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: this.authorizationHeader
        }
      }
    );
    this.authorizationHeader = response.headers.get('Authorization') as string;

    return response;
  }

  async getAllActiveUsers(): Promise<GetUserDto[]> {
    const response = await this.getAllActiveUsersWithHttpResponse();

    const data = await response.json();
    return data as GetUserDto[];
  }

  async getUser(userId: number): Promise<GetUserDto> {
    const response = await fetch(`${HttpClient.baseUrl}/users/${userId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: this.authorizationHeader
      }
    });

    const data = await response.json();
    return data as GetUserDto;
  }

  async getAllActiveUsersWithHttpResponse(): Promise<Response> {
    return await fetch(`${HttpClient.baseUrl}/users`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: this.authorizationHeader
      }
    });
  }

  async deleteUser(userId: number) {
    return await fetch(`${HttpClient.baseUrl}/users/${userId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authorization: this.authorizationHeader
      }
    });
  }

  async registerUser(user: RegisterDto) {
    return await fetch(`${HttpClient.baseUrl}/users`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: this.authorizationHeader
      },
      body: JSON.stringify(user)
    });
  }

  async updateUser(id: number, json_patch: Operation[], transactionId: number) {
    const headers = {
      'Content-Type': 'application/json',
      Authorization: this.authorizationHeader
    } as { [key: string]: any };
    headers[Consts.TRANSACTION_ID_HEADER_NAME as string] =
      transactionId.toString();

    return await fetch(`${HttpClient.baseUrl}/users/${id}`, {
      method: 'PATCH',
      headers: headers,
      body: JSON.stringify(json_patch)
    });
  }

  async getVersion(): Promise<ProjectBasicInfo> {
    const response = await this.getVersionWithHttpResponse();

    const data = await response.json();
    return data as ProjectBasicInfo;
  }

  async getVersionWithHttpResponse(): Promise<Response> {
    return await fetch(`${HttpClient.baseUrl}/version`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }
}
