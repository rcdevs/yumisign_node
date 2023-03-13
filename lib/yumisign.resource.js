"use strict";
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
    _makeRequest(endpoint, init) {
        const uri = endpoint.startsWith('http')
            ? endpoint
            : [
                this._yumisign._getBaseUri(),
                this.basePath,
                this.resourcePath,
                endpoint,
            ].join('');
        const resolveResponse = (resolve, response) => {
            if (response.headers.has('Content-Type') &&
                response.headers.get('Content-Type') === 'application/json') {
                const { headers, status: statusCode } = response;
                const jsonResponse = Promise.resolve(response.json());
                Object.assign(jsonResponse, { lastResponse: { headers, statusCode } });
                resolve(jsonResponse);
            }
            else {
                const textResponse = Promise.resolve(response.text());
                resolve(textResponse);
            }
        };
        const rejectResponse = (reject, response) => {
            Promise.resolve(response.json()).then((jsonResponse) => {
                if (jsonResponse.error) {
                    if (jsonResponse.error.statusCode === 401) {
                        reject(new YumiSignAuthenticationError(jsonResponse.error));
                    }
                    else if (jsonResponse.error.statusCode === 403) {
                        reject(new YumiSignPermissionError(jsonResponse.error));
                    }
                    else {
                        reject(YumiSignError.generate(jsonResponse.error));
                    }
                }
                else {
                    reject(jsonResponse);
                }
            });
        };
        const rejectError = (reject, error) => {
            reject(error instanceof YumiSignError
                ? error
                : YumiSignError.generate({ message: error.message }));
        };
        if (!this.publicUri) {
            const oAuthToken = this._yumisign._getOAuthToken();
            const addAuthorizationHeader = (init, oAuthToken) => {
                const headers = init.headers || {};
                init.headers = Object.assign(Object.assign({}, headers), { Authorization: `${oAuthToken.token_type} ${oAuthToken.access_token}` });
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
                                }
                                else if (retryResponse.ok) {
                                    resolveResponse(resolve, retryResponse);
                                    // Second request error
                                }
                                else {
                                    rejectResponse(reject, retryResponse);
                                }
                            })
                                .catch((error) => rejectError(reject, error));
                        })
                            .catch((error) => rejectError(reject, error));
                        // First request success
                    }
                    else if (response.ok) {
                        resolveResponse(resolve, response);
                        // First request error
                    }
                    else {
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
                }
                else {
                    rejectResponse(reject, response);
                }
            })
                .catch((error) => rejectError(reject, error));
        });
    },
};
module.exports = YumisignResource;
