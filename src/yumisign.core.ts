/* eslint-disable camelcase */
// eslint-disable-next-line spaced-comment
///<reference path='../types/index.d.ts' />
import * as Errors from './Errors.js';
import * as resources from './resources.js';
import {PlatformFunctions} from './platforms/PlatformFunctions.js';
import {createWebhooks} from './Webhooks.js';

const ALLOWED_CONFIGURATIONS: string[] = [
  'clientId',
  'clientSecret',
  'baseUri',
  'oAuthTokenStore',
  'timeout',
];

export function createYumiSign(
  platformFunctions: PlatformFunctions
): typeof YumiSign {
  function YumiSign(this: YumiSignObject, config?: YumiSignObjectConfig): void {
    if (!(this instanceof YumiSign)) {
      return new (YumiSign as any)(config);
    }

    if (
      Object.keys(config || {}).filter(
        (value) => !ALLOWED_CONFIGURATIONS.includes(value)
      ).length > 0
    ) {
      throw new Error(
        `Configuration may only contain the properties: ${ALLOWED_CONFIGURATIONS.join(
          ', '
        )}.`
      );
    }

    this._config = config || {};

    this.errors = Errors;
    this.webhooks = createWebhooks(platformFunctions);

    this._bindResources();
  }

  YumiSign.errors = Errors;
  YumiSign.webhooks = createWebhooks;

  YumiSign.prototype = {
    getBaseUri(): string {
      return this._config?.baseUri || 'https://app.yumisign.com';
    },

    _getClientId(): string {
      const clientId = this._config?.clientId;
      if (!clientId) {
        throw new Error('Client id not defined.');
      }
      return clientId;
    },

    _getClientSecret(): string {
      const clientSecret = this._config?.clientSecret;
      if (!clientSecret) {
        throw new Error('Client secret not defined.');
      }
      return clientSecret;
    },

    _getOAuthToken(): YumiSignOAuthToken {
      const oAuthToken = this._oAuthToken;
      if (!oAuthToken) {
        throw new Errors.YumiSignError({
          message: 'OAuth token not defined.',
        });
      }
      return oAuthToken;
    },

    _setOAuthToken(
      oAuthToken: Omit<YumiSignOAuthToken, 'refresh_token'> & {
        refresh_token?: string;
      }
    ): void {
      const refreshToken =
        oAuthToken?.refresh_token || this._oAuthToken?.refresh_token;
      if (!refreshToken) {
        throw new Error('Refresh token not defined.');
      }
      this._oAuthToken = {...oAuthToken, refresh_token: refreshToken};
    },

    _delOAuthToken(): void {
      this._oAuthToken = undefined;
    },

    _getOAuthTokenStore(): YumiSignOAuthTokenStore {
      const createStorageKey = (): string => `yumisign_${this._getClientId()}`;
      return (
        this._config.oAuthTokenStore || {
          get: (): YumiSignOAuthToken | undefined => {
            const jsonOAuthToken = localStorage.getItem(createStorageKey());
            return jsonOAuthToken ? JSON.parse(jsonOAuthToken) : undefined;
          },
          set: (
            oAuthToken: Omit<YumiSignOAuthToken, 'refresh_token'> & {
              refresh_token?: string;
            }
          ): void => {
            if (oAuthToken.refresh_token) {
              localStorage.setItem(
                createStorageKey(),
                JSON.stringify(oAuthToken)
              );
            } else {
              const prevJsonOAuthToken = localStorage.getItem(
                createStorageKey()
              );
              if (prevJsonOAuthToken) {
                const prevOAuthToken = JSON.parse(prevJsonOAuthToken);
                localStorage.setItem(
                  createStorageKey(),
                  JSON.stringify({
                    ...oAuthToken,
                    refresh_token: prevOAuthToken.refresh_token,
                  })
                );
              } else {
                throw new Error('Refresh token not found.');
              }
            }
          },
          del: (): void => {
            localStorage.removeItem(createStorageKey());
          },
        }
      );
    },

    _getRequestConfig(): YumiSignRequestConfig {
      return {
        timeout: this._config?.timeout || 30000,
      };
    },

    _bindResources(): void {
      for (const name in resources) {
        if (name === 'OAuth') {
          // @ts-ignore
          this.oauth = new resources[name](this);
        } else {
          const camelCaseName = name[0].toLowerCase() + name.substring(1);
          // @ts-ignore
          this[camelCaseName] = new resources[name](this);
        }
      }
    },
  } as YumiSignObject;

  return YumiSign;
}
