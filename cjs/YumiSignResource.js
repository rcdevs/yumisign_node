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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.YumiSignResource = void 0;
const Errors_js_1 = require("./Errors.js");
const proto_js_1 = __importDefault(require("./utils/proto.js"));
// Provide extension mechanism for YumiSign Resource Sub-Classes
YumiSignResource.extend = proto_js_1.default.extend;
function YumiSignResource(yumisign) {
    this._yumisign = yumisign;
    this.publicUri = this.publicUri || false;
    this.basePath = this.basePath || '/api/v1';
    this.initialize(...arguments);
}
exports.YumiSignResource = YumiSignResource;
YumiSignResource.prototype = {
    _yumisign: null,
    publicUri: false,
    basePath: null,
    resourcePath: null,
    initialize() { },
    _makeRequest(endpoint, init) {
        const uri = endpoint.startsWith('http')
            ? endpoint
            : [
                this._yumisign.getBaseUri(),
                this.basePath,
                this.resourcePath,
                endpoint,
            ].join('');
        const resolveResponse = (response) => {
            const { headers, status: statusCode } = response;
            const unknownError = Errors_js_1.YumiSignError.generate({
                statusCode,
                message: 'Unknown error',
            });
            if (headers.has('Content-Type') &&
                headers.get('Content-Type') === 'application/json') {
                return Promise.resolve(response.json()).then((jsonResponse) => {
                    if (response.ok) {
                        Object.assign(jsonResponse, { lastResponse: { headers, statusCode } });
                        return jsonResponse;
                    }
                    else if (jsonResponse.error) {
                        if (jsonResponse.error.statusCode === 401) {
                            throw new Errors_js_1.YumiSignAuthenticationError(jsonResponse.error);
                        }
                        else if (jsonResponse.error.statusCode === 403) {
                            throw new Errors_js_1.YumiSignPermissionError(jsonResponse.error);
                        }
                        else {
                            throw Errors_js_1.YumiSignError.generate(jsonResponse.error);
                        }
                    }
                    else {
                        throw unknownError;
                    }
                });
            }
            else if (response.ok) {
                return Promise.resolve(response.text());
            }
            else {
                return Promise.resolve().then(() => {
                    throw unknownError;
                });
            }
        };
        const rejectError = (error) => Promise.reject(error instanceof Errors_js_1.YumiSignError
            ? error
            : Errors_js_1.YumiSignError.generate({ message: error.message }));
        if (!this.publicUri) {
            const addAuthorizationHeader = (init, oAuthToken) => {
                const { headers } = init, restInit = __rest(init, ["headers"]);
                return Object.assign({ headers: Object.assign(Object.assign({}, (headers || {})), { Authorization: `${oAuthToken.token_type} ${oAuthToken.access_token}` }) }, restInit);
            };
            return fetch(uri, addAuthorizationHeader(init, this._yumisign._getOAuthToken()))
                .then((response) => {
                if (response.status === 401) {
                    return this._yumisign.oauth
                        .refresh({
                        refreshToken: this._yumisign._getOAuthToken().refresh_token,
                    })
                        .then(() => fetch(uri, addAuthorizationHeader(init, this._yumisign._getOAuthToken())).then((retryResponse) => {
                        if (retryResponse.status === 401) {
                            return this._yumisign.oauth
                                .deauthorize()
                                .then(() => retryResponse);
                        }
                        else {
                            return retryResponse;
                        }
                    }))
                        .catch(() => {
                        return this._yumisign.oauth.deauthorize().then(() => response);
                    });
                }
                return response;
            })
                .then((response) => resolveResponse(response))
                .catch((error) => rejectError(error));
        }
        return fetch(uri, init)
            .then((response) => resolveResponse(response))
            .catch((error) => rejectError(error));
    },
};
