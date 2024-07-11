declare module 'yumisign' {
  namespace YumiSign {
    interface OAuthAuthorizeUriParams {
      /**
       * The URI for the authorize response redirect.
       */
      redirectUri: string;

      /**
       * An arbitrary string value we will pass back to you, useful for CSRF protection.
       */
      state: string;
    }

    interface OAuthAccessParams {
      /**
       * The URI for the authorize response redirect.
       */
      redirectUri: string;

      /**
       * The value of the code you receive during the redirection after an authorize success redirection.
       */
      code: string;
    }

    interface OAuthRefreshParams {
      /**
       * The refresh token used for refresh your access token.
       */
      refreshToken: string;
    }

    class OAuthResource extends YumiSignResource {
      /**
       * A helper to know if an oauth token is defined in this service.
       */
      hasToken(): boolean;

      /**
       * Try to retrieve the token in your store.
       */
      findStoredToken(): Promise<YumiSign.OAuthToken | undefined>;

      /**
       * Get a URI to which you can send a user to complete the OAuth flow to authorize their account.
       */
      authorizeUri(params: OAuthAuthorizeUriParams): string;

      /**
       * Turning a code into a refresh_token.
       */
      access(
        params: OAuthAccessParams,
        options?: YumiSign.RequestOptions
      ): Promise<YumiSign.OAuthToken>;

      /**
       * Get a new access token using your refresh_token.
       */
      refresh(
        params: OAuthRefreshParams,
        options?: YumiSign.RequestOptions
      ): Promise<Omit<YumiSign.OAuthToken, 'refresh_token'>>;

      /**
       * Used for revoking access to an account.
       */
      deauthorize(): Promise<undefined>;
    }
  }
}
