import './polyfills/AbortController.js';
import {
  YumiSignAuthenticationError,
  YumiSignError,
  YumiSignPermissionError,
} from './Errors.js';
import {extend} from './utils/proto.js';

// Provide extension mechanism for YumiSign Resource Sub-Classes
YumiSignResource.extend = extend;

function YumiSignResource(
  this: YumiSignResourceObject,
  yumisign: YumiSignObject
): void {
  this._yumisign = yumisign;
  this.publicUri = this.publicUri || false;
  this.basePath = this.basePath || '/api/v1';

  this.initialize(...arguments);
}

YumiSignResource.prototype = {
  _yumisign: null as YumiSignObject | null,
  publicUri: false,
  basePath: null as string | null,
  resourcePath: null as string | null,

  initialize(): void {},

  _createUri(endpoint: string): string {
    return endpoint.startsWith('http')
      ? endpoint
      : [
          this._yumisign.getBaseUri(),
          this.basePath,
          this.resourcePath,
          endpoint,
        ].join('');
  },

  _addAuthorizationHeader(
    init: RequestInit,
    oAuthToken: YumiSignOAuthToken
  ): RequestInit {
    const {headers, ...restInit} = init;
    return {
      headers: {
        ...(headers || ({} as Record<string, any>)),
        Authorization: `${oAuthToken.token_type} ${oAuthToken.access_token}`,
      },
      ...restInit,
    };
  },

  _request(
    uri: string,
    init: RequestInit,
    options?: YumiSignRequestOptions
  ): Promise<Response> {
    const controller = new AbortController();
    const {signal} = controller;
    const requestConfig = this._yumisign._getRequestConfig();

    const timeout = options?.timeout || requestConfig.timeout;
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    return fetch(uri, {...init, signal})
      .then((response) => {
        clearTimeout(timeoutId);
        return response;
      })
      .catch((error) => {
        clearTimeout(timeoutId);
        throw error;
      });
  },

  _makeRequest(
    endpoint: string,
    init: RequestInit,
    options?: YumiSignRequestOptions
  ): Promise<YumiSignResponse<any>> {
    const uri = this._createUri(endpoint);

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
      return this._request(
        uri,
        this._addAuthorizationHeader(init, this._yumisign._getOAuthToken()),
        options
      )
        .then((response) => {
          if (response.status === 401) {
            return this._yumisign.oauth
              .refresh({
                refreshToken: this._yumisign._getOAuthToken().refresh_token,
              })
              .then(() =>
                this._request(
                  uri,
                  this._addAuthorizationHeader(
                    init,
                    this._yumisign._getOAuthToken()
                  ),
                  options
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

    return this._request(uri, init, options)
      .then((response) => resolveResponse(response))
      .catch((error) => rejectError(error));
  },
} as YumiSignResourceObject;

export {YumiSignResource};
