import proto from './utils/proto';
const {
  YumiSignAuthenticationError,
  YumiSignPermissionError,
  YumiSignError,
} = require('./errors');

// Provide extension mechanism for YumiSign Resource Sub-Classes
YumisignResource.extend = proto.extend;

function YumisignResource(
  this: YumiSignResourceObject,
  yumisign: YumiSignObject
): void {
  this._yumisign = yumisign;
  this.publicUri = this.publicUri || false;
  this.basePath = this.basePath || '/api/v1';

  this.initialize(...arguments);
}

YumisignResource.prototype = {
  _yumisign: null as YumiSignObject | null,
  publicUri: false,
  basePath: null as string | null,
  resourcePath: null as string | null,

  initialize(): void {},

  _makeRequest(
    endpoint: string,
    init: RequestInit
  ): Promise<YumiSignResponse<any>> {
    const uri = endpoint.startsWith('http')
      ? endpoint
      : [
          this._yumisign.getBaseUri(),
          this.basePath,
          this.resourcePath,
          endpoint,
        ].join('');

    const resolveResponse = (
      response: Response
    ): Promise<YumiSignResponse<any>> => {
      const {headers, status: statusCode} = response;
      const unknownError = YumiSignError.generate({
        statusCode,
        message: 'Unknown error',
      });

      if (
        headers.has('Content-Type') &&
        headers.get('Content-Type') === 'application/json'
      ) {
        return Promise.resolve(response.json()).then((jsonResponse) => {
          if (response.ok) {
            Object.assign(jsonResponse, {lastResponse: {headers, statusCode}});
            return jsonResponse;
          } else if (jsonResponse.error) {
            if (jsonResponse.error.statusCode === 401) {
              throw new YumiSignAuthenticationError(jsonResponse.error);
            } else if (jsonResponse.error.statusCode === 403) {
              throw new YumiSignPermissionError(jsonResponse.error);
            } else {
              throw YumiSignError.generate(jsonResponse.error);
            }
          } else {
            throw unknownError;
          }
        });
      } else if (response.ok) {
        return Promise.resolve(response.text());
      } else {
        return Promise.resolve().then(() => {
          throw unknownError;
        });
      }
    };

    const rejectError = (error: Error): Promise<YumiSignResponse<any>> =>
      Promise.reject(
        error instanceof YumiSignError
          ? error
          : YumiSignError.generate({message: error.message})
      );

    if (!this.publicUri) {
      const addAuthorizationHeader = (
        init: RequestInit,
        oAuthToken: YumiSignOAuthToken
      ): RequestInit => {
        const {headers, ...restInit} = init;
        return {
          headers: {
            ...(headers || ({} as Record<string, any>)),
            Authorization: `${oAuthToken.token_type} ${oAuthToken.access_token}`,
          },
          ...restInit,
        };
      };

      return fetch(
        uri,
        addAuthorizationHeader(init, this._yumisign._getOAuthToken())
      )
        .then((response) => {
          if (response.status === 401) {
            return this._yumisign.oauth
              .refresh({
                refreshToken: this._yumisign._getOAuthToken().refresh_token,
              })
              .then(() =>
                fetch(
                  uri,
                  addAuthorizationHeader(init, this._yumisign._getOAuthToken())
                ).then((retryResponse) => {
                  if (retryResponse.status === 401) {
                    return this._yumisign.oauth
                      .deauthorize()
                      .then(() => retryResponse);
                  } else {
                    return retryResponse;
                  }
                })
              )
              .catch(() => {
                return this._yumisign.oauth.deauthorize().then(() => response);
              });
          }
          return response;
        })
        .then((response) => resolveResponse(response))
        .catch((error) => rejectError(error));
    }

    return fetch(uri, init)
      .then((response) => resolveResponse(response))
      .catch((error) => rejectError(error));
  },
} as YumiSignResourceObject;

export = YumisignResource;
