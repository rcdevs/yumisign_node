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
const axios_1 = require("axios");
const proto_1 = require("./utils/proto");
const { YumiSignAuthenticationError, YumiSignPermissionError, YumiSignError, } = require('./errors');
// Provide extension mechanism for YumiSign Resource Sub-Classes
YumisignResource.extend = proto_1.default.extend;
function YumisignResource(yumisign) {
    this._yumisign = yumisign;
    this.publicUri = this.publicUri || false;
    this.basePath = this.basePath || '/api/v1';
    this.initialize(...arguments);
}
YumisignResource.prototype = {
    _yumisign: null,
    publicUri: false,
    basePath: null,
    resourcePath: null,
    initialize() { },
    _makeRequest(config) {
        const { url } = config, restConfig = __rest(config, ["url"]);
        const uri = url !== null && url !== void 0 ? url : '';
        const requestConfig = Object.assign(Object.assign({}, restConfig), { url: uri.startsWith('http')
                ? uri
                : [
                    this._yumisign.getBaseUri(),
                    this.basePath,
                    this.resourcePath,
                    uri,
                ].join('') });
        const resolveResponse = (resolve, response) => {
            if (response.headers['content-type'] === 'application/json') {
                const { headers, status: statusCode } = response;
                const jsonResponse = Promise.resolve(response.data);
                Object.assign(jsonResponse, { lastResponse: { headers, statusCode } });
                resolve(jsonResponse);
            }
            else {
                const textResponse = Promise.resolve(response.data);
                resolve(textResponse);
            }
        };
        const rejectResponse = (reject, errorResponse) => {
            const errorData = errorResponse.data || {};
            if (errorData.error) {
                if (errorData.error.statusCode === 401) {
                    reject(new YumiSignAuthenticationError(errorData.error));
                }
                else if (errorData.error.statusCode === 403) {
                    reject(new YumiSignPermissionError(errorData.error));
                }
                else {
                    reject(YumiSignError.generate(errorData.error));
                }
            }
            else {
                reject(errorResponse);
            }
        };
        const rejectError = (reject, error) => {
            reject(error instanceof YumiSignError
                ? error
                : YumiSignError.generate({ message: error.message }));
        };
        if (!this.publicUri) {
            const addAuthorizationHeader = (config) => {
                const oAuthToken = this._yumisign._getOAuthToken();
                const headers = config.headers || {};
                return Object.assign(Object.assign({}, config), { headers: Object.assign(Object.assign({}, headers), { Authorization: `${oAuthToken.token_type} ${oAuthToken.access_token}` }) });
            };
            return new Promise((resolve, reject) => {
                return axios_1.default
                    .request(addAuthorizationHeader(requestConfig))
                    .then((response) => resolveResponse(resolve, response))
                    .catch((error) => {
                    var _a, _b;
                    if (((_a = error.response) === null || _a === void 0 ? void 0 : _a.status) === 401) {
                        const oAuthToken = this._yumisign._getOAuthToken();
                        return this._yumisign.oauth
                            .refresh({
                            refreshToken: oAuthToken.refresh_token,
                        })
                            .then(() => axios_1.default
                            .request(addAuthorizationHeader(requestConfig))
                            .then((retryResponse) => resolveResponse(resolve, retryResponse))
                            .catch((retryError) => {
                            var _a, _b;
                            if (((_a = retryError.response) === null || _a === void 0 ? void 0 : _a.status) === 401) {
                                return this._yumisign.oauth
                                    .deauthorize()
                                    .then(() => {
                                    rejectResponse(reject, retryError.response);
                                })
                                    .catch((error) => rejectError(reject, error));
                            }
                            else if ((_b = retryError.response) === null || _b === void 0 ? void 0 : _b.status) {
                                rejectResponse(reject, retryError.response);
                            }
                            else {
                                rejectError(reject, retryError);
                            }
                        }))
                            .catch((error) => rejectError(reject, error));
                    }
                    else if ((_b = error.response) === null || _b === void 0 ? void 0 : _b.status) {
                        rejectResponse(reject, error.response);
                    }
                    else {
                        rejectError(reject, error);
                    }
                });
            });
        }
        return new Promise((resolve, reject) => {
            axios_1.default
                .request(requestConfig)
                .then((response) => resolveResponse(resolve, response))
                .catch((error) => rejectError(reject, error));
        });
    },
};
module.exports = YumisignResource;
