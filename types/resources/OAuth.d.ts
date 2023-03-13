declare module 'yumisign' {
  namespace YumiSign {
    interface OAuthToken {
      /**
       * The access token you can use to make requests on your YumiSign account.
       */
      access_token: string;

      /**
       * The expiration duration of your access token in seconds.
       */
      expires_in: number;

      /**
       * The refresh token you can use to refresh your access token.
       */
      refresh_token: string;

      /**
       * Will always have a value of bearer.
       */
      token_type: 'Bearer';
    }
  }
}
