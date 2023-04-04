import axios, {AxiosRequestConfig, AxiosResponse} from 'axios';
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

  _makeRequest(config: AxiosRequestConfig): Promise<YumiSignResponse<any>> {
    const {url, ...restConfig} = config;
    const uri = url ?? '';
    const requestConfig = {
      ...restConfig,
      url: uri.startsWith('http')
        ? uri
        : [
            this._yumisign.getBaseUri(),
            this.basePath,
            this.resourcePath,
            uri,
          ].join(''),
    };

    const resolveResponse = (
      resolve: (value: any) => void,
      response: AxiosResponse
    ): void => {
      if (response.headers['content-type'] === 'application/json') {
        const {headers, status: statusCode} = response;
        const jsonResponse = Promise.resolve(response.data);
        Object.assign(jsonResponse, {lastResponse: {headers, statusCode}});
        resolve(jsonResponse);
      } else {
        const textResponse = Promise.resolve(response.data);
        resolve(textResponse);
      }
    };

    const rejectResponse = (
      reject: (value: any) => void,
      errorResponse: AxiosResponse
    ): void => {
      const errorData = errorResponse.data || {};
      if (errorData.error) {
        if (errorData.error.statusCode === 401) {
          reject(new YumiSignAuthenticationError(errorData.error));
        } else if (errorData.error.statusCode === 403) {
          reject(new YumiSignPermissionError(errorData.error));
        } else {
          reject(YumiSignError.generate(errorData.error));
        }
      } else {
        reject(errorResponse);
      }
    };

    const rejectError = (reject: (value: any) => void, error: Error): void => {
      reject(
        error instanceof YumiSignError
          ? error
          : YumiSignError.generate({message: error.message})
      );
    };

    if (!this.publicUri) {
      const addAuthorizationHeader = (
        config: AxiosRequestConfig
      ): AxiosRequestConfig => {
        const oAuthToken = this._yumisign._getOAuthToken();
        const headers = config.headers || ({} as {[key: string]: any});
        return {
          ...config,
          headers: {
            ...headers,
            Authorization: `${oAuthToken.token_type} ${oAuthToken.access_token}`,
          },
        };
      };

      return new Promise((resolve, reject) => {
        return axios
          .request(addAuthorizationHeader(requestConfig))
          .then((response) => resolveResponse(resolve, response))
          .catch((error) => {
            if (error.response?.status === 401) {
              const oAuthToken = this._yumisign._getOAuthToken();
              return this._yumisign.oauth
                .refresh({
                  refreshToken: oAuthToken.refresh_token,
                })
                .then(() =>
                  axios
                    .request(addAuthorizationHeader(requestConfig))
                    .then((retryResponse) =>
                      resolveResponse(resolve, retryResponse)
                    )
                    .catch((retryError) => {
                      if (retryError.response?.status === 401) {
                        return this._yumisign.oauth
                          .deauthorize()
                          .then(() => {
                            rejectResponse(reject, retryError.response);
                          })
                          .catch((error) => rejectError(reject, error));
                      } else if (retryError.response?.status) {
                        rejectResponse(reject, retryError.response);
                      } else {
                        rejectError(reject, retryError);
                      }
                    })
                )
                .catch((error) => rejectError(reject, error));
            } else if (error.response?.status) {
              rejectResponse(reject, error.response);
            } else {
              rejectError(reject, error);
            }
          });
      });
    }

    return new Promise((resolve, reject) => {
      axios
        .request(requestConfig)
        .then((response) => resolveResponse(resolve, response))
        .catch((error) => rejectError(reject, error));
    });
  },
} as YumiSignResourceObject;

export = YumisignResource;
