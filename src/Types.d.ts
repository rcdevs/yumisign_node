/* eslint-disable camelcase */
type YumiSignResponse<T> = T & {
  lastResponse: {
    headers: {[key: string]: string};
    statusCode: number;
  };
};

type YumiSignRawError = {
  message: string;
  code?: string;
  statusCode?: number;
  violations?: {[key: string]: string};
};

type YumiSignEvent = {
  type: string;
  data: {
    type: string;
    object: Record<string, unknown>;
  };
};

type YumiSignOAuthToken = {
  access_token: string;
  expires_in: number;
  refresh_token: string;
  token_type: 'Bearer';
};

type YumiSignOAuthTokenStore = {
  get: () =>
    | YumiSignOAuthToken
    | undefined
    | Promise<YumiSignOAuthToken | undefined>;
  set: (
    oAuthToken: Omit<YumiSignOAuthToken, 'refresh_token'> & {
      refresh_token?: string;
    }
  ) => void | Promise<YumiSignOAuthToken>;
  del: () => void | Promise<undefined>;
};

type YumiSignObjectConfig = {
  baseUri?: string;
  clientId?: string;
  clientSecret?: string;
  oAuthTokenStore?: YumiSignOAuthTokenStore;
};

type YumiSignConstructor = {
  new (config?: YumiSignObjectConfig): YumiSignObject;
};

declare const YumiSign: YumiSignConstructor;

type YumiSignObject = {
  _oAuthToken?: YumiSignOAuthToken;
  _config: YumiSignObjectConfig;
  errors: any;
  webhooks: any;
  getBaseUri(): string;
  _getClientId(): string;
  _getClientSecret(): string;
  _getOAuthToken(): YumiSignOAuthToken;
  _setOAuthToken(
    oAuthToken: Omit<YumiSignOAuthToken, 'refresh_token'> & {
      refresh_token?: string;
    }
  ): void;
  _delOAuthToken(): void;
  _getOAuthTokenStore(): YumiSignOAuthTokenStore;
  _bindResources: () => void;
  oauth: {
    refresh: ({
      refreshToken,
    }: {
      refreshToken: string;
    }) => Promise<YumiSignResponse<any>>;
    deauthorize(): Promise<undefined>;
  };
};

type YumiSignResourceConstructor = {
  new (yumisign: YumiSignObject): YumiSignResourceObject;
};

declare const YumiSignResource: YumiSignResourceConstructor;

type YumiSignResourceObject = {
  _yumisign: YumiSignObject;
  publicUri: boolean;
  basePath: string;
  resourcePath: string;
  initialize: (...args: Array<any>) => void; // eslint-disable-line @typescript-eslint/no-explicit-any
  _makeRequest(
    endpoint: string,
    init: RequestInit
  ): Promise<YumiSignResponse<any>>; // eslint-disable-line @typescript-eslint/no-explicit-any
};

type YumiSignWebhookEvent = Record<string, unknown>;

type YumiSignWebhookObject = {
  constructEvent(
    payload: string | Uint8Array,
    header: string | Uint8Array,
    secret: string,
    tolerance?: number,
    receivedAt?: number
  ): YumiSignWebhookEvent;
  verifySignature(
    encodedPayload: string | Uint8Array,
    encodedHeader: string | Uint8Array,
    secret: string,
    tolerance: number,
    receivedAt?: number
  ): boolean;
};

type YumiSignPaginationParams = {
  limit: number;
  page: number;
};
