"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createYumiSign = void 0;
/* eslint-disable camelcase */
// eslint-disable-next-line spaced-comment
///<reference path='../types/index.d.ts' />
const errors = __importStar(require("./Errors.js"));
const resources = __importStar(require("./resources.js"));
const Webhooks_js_1 = require("./Webhooks.js");
function createYumiSign(platformFunctions) {
    function YumiSign(config) {
        if (!(this instanceof YumiSign)) {
            return new YumiSign(config);
        }
        this._config = config;
        this.errors = errors;
        this.webhooks = (0, Webhooks_js_1.createWebhooks)(platformFunctions);
        this._bindResources();
    }
    YumiSign.errors = errors;
    YumiSign.webhooks = Webhooks_js_1.createWebhooks;
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
exports.createYumiSign = createYumiSign;
