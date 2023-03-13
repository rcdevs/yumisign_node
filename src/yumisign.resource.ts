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
          this._yumisign._getBaseUri(),
          this.basePath,
          this.resourcePath,
          endpoint,
        ].join('');

    const resolveResponse = (
      resolve: (value: any) => void,
      response: Response
    ): void => {
      if (
        response.headers.has('Content-Type') &&
        response.headers.get('Content-Type') === 'application/json'
      ) {
        const {headers, status: statusCode} = response;
        const jsonResponse = Promise.resolve(response.json());
        Object.assign(jsonResponse, {lastResponse: {headers, statusCode}});
        resolve(jsonResponse);
      } else {
        const textResponse = Promise.resolve(response.text());
        resolve(textResponse);
      }
    };

    const rejectResponse = (
      reject: (value: any) => void,
      response: Response
    ): void => {
      Promise.resolve(response.json()).then((jsonResponse) => {
        if (jsonResponse.error) {
          if (jsonResponse.error.statusCode === 401) {
            reject(new YumiSignAuthenticationError(jsonResponse.error));
          } else if (jsonResponse.error.statusCode === 403) {
            reject(new YumiSignPermissionError(jsonResponse.error));
          } else {
            reject(YumiSignError.generate(jsonResponse.error));
          }
        } else {
          reject(jsonResponse);
        }
      });
    };

    const rejectError = (reject: (value: any) => void, error: Error): void => {
      reject(
        error instanceof YumiSignError
          ? error
          : YumiSignError.generate({message: error.message})
      );
    };

    if (!this.publicUri) {
      const oAuthToken = this._yumisign._getOAuthToken();

      const addAuthorizationHeader = (
        init: RequestInit,
        oAuthToken: YumiSignOAuthToken
      ): void => {
        const headers = init.headers || ({} as Record<string, any>);
        init.headers = {
          ...headers,
          Authorization: `${oAuthToken.token_type} ${oAuthToken.access_token}`,
        };
      };

      addAuthorizationHeader(init, oAuthToken);

      return new Promise((resolve, reject) => {
        fetch(uri, init)
          .then((response) => {
            // Need to refresh access token
            if (response.status === 401) {
              this._yumisign.oauth
                .refresh({
                  refreshToken: oAuthToken.refresh_token,
                })
                .then(() => {
                  addAuthorizationHeader(init, this._yumisign._getOAuthToken());
                  fetch(uri, init)
                    .then((retryResponse) => {
                      // When refresh token return 401 remove this token
                      if (retryResponse.status === 401) {
                        this._yumisign.oauth
                          .deauthorize()
                          .then(() => {
                            rejectResponse(reject, retryResponse);
                          })
                          .catch((error) => rejectError(reject, error));
                        // Second request success
                      } else if (retryResponse.ok) {
                        resolveResponse(resolve, retryResponse);
                        // Second request error
                      } else {
                        rejectResponse(reject, retryResponse);
                      }
                    })
                    .catch((error) => rejectError(reject, error));
                })
                .catch((error) => rejectError(reject, error));
              // First request success
            } else if (response.ok) {
              resolveResponse(resolve, response);
              // First request error
            } else {
              rejectResponse(reject, response);
            }
          })
          .catch((error) => rejectError(reject, error));
      });
    }

    return new Promise((resolve, reject) => {
      fetch(uri, init)
        .then((response) => {
          if (response.ok) {
            resolveResponse(resolve, response);
          } else {
            rejectResponse(reject, response);
          }
        })
        .catch((error) => rejectError(reject, error));
    });
  },
} as YumiSignResourceObject;

export = YumisignResource;
