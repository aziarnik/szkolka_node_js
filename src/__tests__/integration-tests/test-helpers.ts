import { Consts } from '../../consts';

export class IntegrationTestHelpers {
  static wait(time: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, time));
  }

  static getAccessToken(response: Response) {
    return (
      response.headers.get(Consts.AUTHORIZATION_HEADER) as string
    ).substring(Consts.AUTHORIZATION_HEADER_BEGINNING_LENGTH);
  }
}
