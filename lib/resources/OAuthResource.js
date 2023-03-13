"use strict";
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
const YumiSignResource = require('../yumisign.resource');
const authorizePath = '/integration-apps/authorize';
module.exports = YumiSignResource.extend({
    publicUri: true,
    resourcePath: '/OAuth/v2',
    hasToken() {
        try {
            return !!this._yumisign._getOAuthToken();
        }
        catch (e) {
            return false;
        }
    },
    findStoredToken() {
        return new Promise((resolve, reject) => {
            const getValue = this._yumisign._getOAuthTokenStore().get();
            if (typeof getValue === 'undefined') {
                resolve(undefined);
            }
            else {
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
    authorizeUri(params) {
        return [
            `${this._yumisign._getBaseUri()}${authorizePath}`,
            `?client_id=${this._yumisign._getClientId()}`,
            `&redirect_uri=${params.redirectUri}`,
            `&state=${params.state}`,
            '&response_type=code',
        ].join('');
    },
    access(params) {
        return new Promise((resolve, reject) => {
            this._makeRequest('/access', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    client_id: this._yumisign._getClientId(),
                    client_secret: this._yumisign._getClientSecret(),
                    redirect_uri: params.redirectUri,
                    code: params.code,
                    grant_type: 'code',
                }),
            })
                .then((oAuthTokenResponse) => {
                const { lastResponse } = oAuthTokenResponse, oAuthToken = __rest(oAuthTokenResponse, ["lastResponse"]);
                this._yumisign._setOAuthToken(oAuthToken);
                const setValue = this._yumisign
                    ._getOAuthTokenStore()
                    .set(this._yumisign._getOAuthToken());
                if (typeof setValue === 'undefined') {
                    resolve(oAuthToken);
                }
                else {
                    Promise.resolve(setValue)
                        .then((token) => resolve(token))
                        .catch((error) => reject(error));
                }
            })
                .catch((error) => reject(error));
        });
    },
    refresh(params) {
        return new Promise((resolve, reject) => {
            this._makeRequest('/refresh', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    client_id: this._yumisign._getClientId(),
                    client_secret: this._yumisign._getClientSecret(),
                    refresh_token: params.refreshToken,
                }),
            })
                .then((oAuthTokenResponse) => {
                const { lastResponse } = oAuthTokenResponse, oAuthToken = __rest(oAuthTokenResponse, ["lastResponse"]);
                this._yumisign._setOAuthToken(oAuthToken);
                const setValue = this._yumisign
                    ._getOAuthTokenStore()
                    .set(this._yumisign._getOAuthToken());
                if (typeof setValue === 'undefined') {
                    resolve(oAuthToken);
                }
                else {
                    Promise.resolve(setValue)
                        .then((token) => resolve(token))
                        .catch((error) => reject(error));
                }
            })
                .catch((error) => reject(error));
        });
    },
    deauthorize() {
        return new Promise((resolve, reject) => {
            const delValue = this._yumisign._getOAuthTokenStore().del();
            if (typeof delValue === 'undefined') {
                resolve(undefined);
            }
            else {
                Promise.resolve(delValue)
                    .then(() => {
                    this._yumisign._delOAuthToken();
                    resolve(undefined);
                })
                    .catch((error) => reject(error));
            }
        });
    },
});
