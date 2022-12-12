export type ClientOptions = {
  /**
   *  Seraph API Key
   */
  apiKey: string
  /**
   *  Set a custom user agent when making calls to the Seraph API
   */
  userAgent?: string
}

export class SeraphApi {

  private apiKey;
  private isKeyLocked = false;

  constructor(options: ClientOptions) {
    this.apiKey = options.apiKey;
  }

}
