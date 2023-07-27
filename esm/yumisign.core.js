/* eslint-disable camelcase */
// eslint-disable-next-line spaced-comment
///<reference path='../types/index.d.ts' />
import * as errors from './Errors.js';
import * as resources from './resources.js';
import { createWebhooks } from './Webhooks.js';
export function createYumiSign(platformFunctions) {
    function YumiSign(config) {
        if (!(this instanceof YumiSign)) {
            return new YumiSign(config);
        }
        this._config = config;
        this.errors = errors;
        this.webhooks = createWebhooks(platformFunctions);
        this._bindResources();
    }
    YumiSign.errors = errors;
    YumiSign.webhooks = createWebhooks;
    YumiSign.prototype = {
        getBaseUri() {
            var _a;
            return ((_a = this._config) === null || _a === void 0 ? void 0 : _a.baseUri) || 'https://app.yumisign.com';
        },
        _getClientId() {
            var _a;
            const clientId = (_a = this._config) === null || _a === void 0 ? void 0 : _a.clientId;
            if (!clientId) {
                throw new Error('YumiSign: Client id not defined.');
            }
            return clientId;
        },
        _getClientSecret() {
            var _a;
            const clientSecret = (_a = this._config) === null || _a === void 0 ? void 0 : _a.clientSecret;
            if (!clientSecret) {
                throw new Error('YumiSign: Client secret not defined.');
            }
            return clientSecret;
        },
        _getOAuthToken() {
            const oAuthToken = this._oAuthToken;
            if (!oAuthToken) {
                throw new Error('YumiSign: OAuth token not defined.');
            }
            return oAuthToken;
        },
        _setOAuthToken(oAuthToken) {
            var _a;
            const refreshToken = (oAuthToken === null || oAuthToken === void 0 ? void 0 : oAuthToken.refresh_token) || ((_a = this._oAuthToken) === null || _a === void 0 ? void 0 : _a.refresh_token);
            if (!refreshToken) {
                throw new Error('YumiSign: Refresh token not defined.');
            }
            this._oAuthToken = Object.assign(Object.assign({}, oAuthToken), { refresh_token: refreshToken });
        },
        _delOAuthToken() {
            this._oAuthToken = undefined;
        },
        _getOAuthTokenStore() {
            const createStorageKey = () => `yumisign_${this._getClientId()}`;
            return (this._config.oAuthTokenStore || {
                get: () => {
                    const jsonOAuthToken = localStorage.getItem(createStorageKey());
                    return jsonOAuthToken ? JSON.parse(jsonOAuthToken) : undefined;
                },
                set: (oAuthToken) => {
                    if (oAuthToken.refresh_token) {
                        localStorage.setItem(createStorageKey(), JSON.stringify(oAuthToken));
                    }
                    else {
                        const prevJsonOAuthToken = localStorage.getItem(createStorageKey());
                        if (prevJsonOAuthToken) {
                            const prevOAuthToken = JSON.parse(prevJsonOAuthToken);
                            localStorage.setItem(createStorageKey(), JSON.stringify(Object.assign(Object.assign({}, oAuthToken), { refresh_token: prevOAuthToken.refresh_token })));
                        }
                        else {
                            throw new Error('Refresh token not found.');
                        }
                    }
                },
                del: () => {
                    localStorage.removeItem(createStorageKey());
                },
            });
        },
        _bindResources() {
            for (const name in resources) {
                if (name === 'OAuth') {
                    // @ts-ignore
                    this.oauth = new resources[name](this);
                }
                else {
                    const camelCaseName = name[0].toLowerCase() + name.substring(1);
                    // @ts-ignore
                    this[camelCaseName] = new resources[name](this);
                }
            }
        },
    };
    return YumiSign;
}
