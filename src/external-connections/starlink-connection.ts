import fetch from 'cross-fetch';

export class StarlinkHttpClient {
  private static getStarlinksUrl = 'https://api.spacexdata.com/v4/starlink';
  static async getStarlinks(): Promise<any[]> {
    const response = await fetch(`${this.getStarlinksUrl}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    });
    const data = await response.json();
    return data;
  }
}
