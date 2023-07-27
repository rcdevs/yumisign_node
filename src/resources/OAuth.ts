import YumiSign from 'yumisign';
import {YumiSignResource} from '../YumiSignResource.js';

const authorizePath = '/integration-apps/authorize';

export const OAuth = YumiSignResource.extend({
  publicUri: true,
  resourcePath: '/OAuth/v2',

  hasToken(): boolean {
    try {
      return !!this._yumisign._getOAuthToken();
    } catch (e) {
      return false;
    }
  },

  findStoredToken(): Promise<YumiSign.OAuthToken | undefined> {
    return new Promise((resolve, reject) => {
      const getValue = this._yumisign._getOAuthTokenStore().get();
      if (typeof getValue === 'undefined') {
        resolve(undefined);
      } else {
        Promise.resolve(getValue)
          .then((oAuthToken) => {
            if (oAuthToken) {
              this._yumisign._setOAuthToken(oAuthToken);
            }
            resolve(oAuthToken);
          })
          .catch((error) => reject(error));
      }
    });
  },

  authorizeUri(params: YumiSign.OAuthAuthorizeUriParams): string {
    return [
      `${this._yumisign.getBaseUri()}${authorizePath}`,
      `?client_id=${this._yumisign._getClientId()}`,
      `&redirect_uri=${params.redirectUri}`,
      `&state=${params.state}`,
      '&response_type=code',
    ].join('');
  },

  access(params: YumiSign.OAuthAccessParams): Promise<YumiSign.OAuthToken> {
    return new Promise((resolve, reject) => {
      this._makeRequest<YumiSign.OAuthToken>('/access', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
          client_id: this._yumisign._getClientId(),
          client_secret: this._yumisign._getClientSecret(),
          redirect_uri: params.redirectUri,
          code: params.code,
          grant_type: 'code',
        }),
      })
        .then((oAuthTokenResponse) => {
          const {lastResponse, ...oAuthToken} = oAuthTokenResponse;

          this._yumisign._setOAuthToken(oAuthToken);
          const setValue = this._yumisign
            ._getOAuthTokenStore()
            .set(this._yumisign._getOAuthToken());

          if (typeof setValue === 'undefined') {
            resolve(oAuthToken);
          } else {
            Promise.resolve(setValue)
              .then((token) => resolve(token))
              .catch((error) => reject(error));
          }
        })
        .catch((error) => reject(error));
    });
  },

  refresh(
    params: YumiSign.OAuthRefreshParams
  ): Promise<Omit<YumiSign.OAuthToken, 'refresh_token'>> {
    return new Promise((resolve, reject) => {
      this._makeRequest<Omit<YumiSign.OAuthToken, 'refresh_token'>>(
        '/refresh',
        {
          method: 'POST',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify({
            client_id: this._yumisign._getClientId(),
            client_secret: this._yumisign._getClientSecret(),
            refresh_token: params.refreshToken,
          }),
        }
      )
        .then((oAuthTokenResponse) => {
          const {lastResponse, ...oAuthToken} = oAuthTokenResponse;

          this._yumisign._setOAuthToken(oAuthToken);
          const setValue = this._yumisign
            ._getOAuthTokenStore()
            .set(this._yumisign._getOAuthToken());

          if (typeof setValue === 'undefined') {
            resolve(oAuthToken);
          } else {
            Promise.resolve(setValue)
              .then((token) => resolve(token))
              .catch((error) => reject(error));
          }
        })
        .catch((error) => reject(error));
    });
  },

  deauthorize(): Promise<undefined> {
    return new Promise((resolve, reject) => {
      const delValue = this._yumisign._getOAuthTokenStore().del();
      if (typeof delValue === 'undefined') {
        resolve(undefined);
      } else {
        Promise.resolve(delValue)
          .then(() => {
            this._yumisign._delOAuthToken();
            resolve(undefined);
          })
          .catch((error) => reject(error));
      }
    });
  },
} as YumiSign.OAuthResource);
