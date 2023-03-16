/* eslint-disable camelcase */
// eslint-disable-next-line spaced-comment
///<reference path='../types/yumisign.d.ts' />

const EnvelopesResource = require('./resources/EnvelopesResource');
const OAuthResource = require('./resources/OAuthResource');
const ProfileResource = require('./resources/ProfileResource');
const WorkspacesResource = require('./resources/WorkspacesResource');

function YumiSign(this: YumiSignObject, config: YumiSignObjectConfig): void {
  if (!(this instanceof YumiSign)) {
    return new (YumiSign as any)(config);
  }

  this._config = config;
  this._bindResources();
}

YumiSign.prototype = {
  getBaseUri(): string {
    return this._config?.baseUri || 'https://app.yumisign.com';
  },

  _getClientId(): string {
    const clientId = this._config?.clientId;
    if (!clientId) {
      throw new Error('YumiSign: Client id not defined.');
    }
    return clientId;
  },

  _getClientSecret(): string {
    const clientSecret = this._config?.clientSecret;
    if (!clientSecret) {
      throw new Error('YumiSign: Client secret not defined.');
    }
    return clientSecret;
  },

  _getOAuthToken(): YumiSignOAuthToken {
    const oAuthToken = this._oAuthToken;
    if (!oAuthToken) {
      throw new Error('YumiSign: OAuth token not defined.');
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
      throw new Error('YumiSign: Refresh token not defined.');
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
            const prevJsonOAuthToken = localStorage.getItem(createStorageKey());
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

  _bindResources(): void {
    this.envelopes = new EnvelopesResource(this);
    this.oauth = new OAuthResource(this);
    this.profile = new ProfileResource(this);
    this.workspaces = new WorkspacesResource(this);
  },
} as YumiSignObject & {
  envelopes: typeof EnvelopesResource;
  oauth: typeof OAuthResource;
  profile: typeof ProfileResource;
  workspaces: typeof WorkspacesResource;
};

module.exports = YumiSign;
module.exports.YumiSign = YumiSign;
module.exports.default = YumiSign;
