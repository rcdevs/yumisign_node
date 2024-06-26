///<reference path='./Errors.d.ts' />
///<reference path='./Webhooks.d.ts' />
///<reference path='./resources/Actions.d.ts' />
///<reference path='./resources/AppResource.d.ts' />
///<reference path='./resources/Documents.d.ts' />
///<reference path='./resources/Envelopes.d.ts' />
///<reference path='./resources/EnvelopesResource.d.ts' />
///<reference path='./resources/Events.d.ts' />
///<reference path='./resources/Files.d.ts' />
///<reference path='./resources/HttpSources.d.ts' />
///<reference path='./resources/OAuth.d.ts' />
///<reference path='./resources/OAuthResource.d.ts' />
///<reference path='./resources/Preferences.d.ts' />
///<reference path='./resources/Profile.d.ts' />
///<reference path='./resources/ProfileResource.d.ts' />
///<reference path='./resources/Steps.d.ts' />
///<reference path='./resources/SubscriptionItems.d.ts' />
///<reference path='./resources/Subscriptions.d.ts' />
///<reference path='./resources/SubscriptionsResource.d.ts' />
///<reference path='./resources/Templates.d.ts' />
///<reference path='./resources/TemplatesResource.d.ts' />
///<reference path='./resources/Workspaces.d.ts' />
///<reference path='./resources/WorkspacesResource.d.ts' />

declare module 'yumisign' {
  // Added to in other modules, referenced above.
  export namespace YumiSign {
    type Response<T> = T & {
      lastResponse: {
        headers: {[key: string]: string};
        statusCode: number;
      };
    };

    /**
     * Set of key-value pairs that you can attach to an object. This can be useful for storing additional information about the object in a structured format.
     */
    interface Metadata {
      [name: string]: string;
    }

    /**
     * Set of key-value pairs that you can attach to an object. This can be useful for storing additional information about the object in a structured format.
     * While you can send values as numbers, they will be returned as strings.
     */
    interface MetadataParam {
      [name: string]: string | number | null;
    }

    /**
     * A container for a bulk response item.
     */
    interface BulkItem<T> {
      identifier: string;
      result: boolean;
      response?: T;
      error?: {
        message: string;
        code?: string;
      };
    }

    interface BulkPromise<T> extends Promise<Response<BulkItem<T>[]>> {}

    /**
     * A container for paginated lists of objects.
     */
    interface PaginatedList<T> {
      total: number;
      limit: number;
      pages: number;
      items: Array<T>;
    }

    interface AutoPagination<T> extends AsyncIterableIterator<T> {
      each(
        handler: (item: T) => boolean | void | Promise<boolean | void>
      ): Promise<void>;
      toArray(options?: {limit?: number}): Promise<Array<T>>;
    }

    interface PaginatedListPromise<T>
      extends Promise<Response<PaginatedList<T>>>,
        AutoPagination<T> {}

    interface PaginationParams {
      /**
       * A limit on the number of objects to be returned. The default is 8.
       */
      limit?: number;

      /**
       * The number of the page contain objects. The default is 1.
       */
      page?: number;

      /**
       * The search query string.
       */
      query?: string;
    }
  }

  interface YumiSignOAuthTokenStore {
    /**
     * A function to retrieve the oauth token on your store.
     */
    get: () =>
      | YumiSign.OAuthToken
      | undefined
      | Promise<YumiSign.OAuthToken | undefined>;

    /**
     * A function to store the oauth token when it changes.
     */
    set: (
      oAuthToken: Omit<YumiSign.OAuthToken, 'refresh_token'> & {
        refresh_token?: string;
      }
    ) => void | Promise<YumiSign.OAuthToken>;

    /**
     * A function to delete the stored oauth token.
     */
    del: () => void | Promise<undefined>;
  }

  interface YumiSignConfig {
    /**
     * The base uri on the YumiSign application. Default 'https://app.yumisign.com'.
     * Useful during development for test your code on dev/test YumiSign environment.
     */
    baseUri?: string;

    /**
     * The client id of the YumiSign application that you'd like to connect the account from.
     */
    clientId?: string;

    /**
     * The client secret of the YumiSign application that you'd like to connect the account from.
     */
    clientSecret?: string;

    /**
     * The oauth token store for retrieve token on mount and change it on refresh.
     */
    oAuthTokenStore?: YumiSignOAuthTokenStore;
  }

  export class YumiSign {
    static YumiSign: typeof YumiSign;

    constructor(config?: YumiSignConfig);

    errors: typeof YumiSign.Errors;
    webhooks: YumiSign.Webhooks;

    app: YumiSign.AppResource;
    envelopes: YumiSign.EnvelopesResource;
    oauth: YumiSign.OAuthResource;
    profile: YumiSign.ProfileResource;
    subscriptions: YumiSign.SubscriptionsResource;
    templates: YumiSign.TemplatesResource;
    workspaces: YumiSign.WorkspacesResource;

    getBaseUri(): string;
    _getClientId(): string;
    _getClientSecret(): string;
    _getOAuthToken(): YumiSign.OAuthToken;
    _setOAuthToken(
      oAuthToken: Omit<YumiSign.OAuthToken, 'refresh_token'> & {
        refresh_token?: string;
      }
    ): void;
    _delOAuthToken(): void;
    _getOAuthTokenStore(): YumiSignOAuthTokenStore;
  }

  export class YumiSignResource {
    static YumiSignResource: typeof YumiSignResource;

    constructor(yumisign: YumiSign);

    _yumisign: YumiSign;
    publicUri: boolean;
    resourcePath: string;
    _makeRequest<T>(
      endpoint: string,
      init: RequestInit
    ): Promise<YumiSign.Response<T>>;
  }

  export default YumiSign;
}
