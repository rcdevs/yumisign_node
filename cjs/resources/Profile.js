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
exports.Profile = void 0;
const transformer_js_1 = require("../utils/transformer.js");
const YumiSignResource_js_1 = require("../YumiSignResource.js");
exports.Profile = YumiSignResource_js_1.YumiSignResource.extend({
    resourcePath: '/profile',
    retrieve() {
        return this._makeRequest('', { method: 'GET' });
    },
    listActions(params) {
        let endpoint = '/actions';
        if (params) {
            const urlSearchParams = new URLSearchParams();
            Object.entries(params).forEach(([key, value]) => {
                urlSearchParams.append(key, value);
            });
            endpoint =
                urlSearchParams.toString().length > 0
                    ? endpoint + `?${urlSearchParams.toString()}`
                    : endpoint;
        }
        return this._makeRequest(endpoint, { method: 'GET' }).then((paginatedList) => {
            const { items } = paginatedList, rest = __rest(paginatedList, ["items"]);
            return Object.assign({ items: items.map((item) => (0, transformer_js_1.transformAction)(item)) }, rest);
        });
    },
    listSignedEnvelopes(params) {
        let endpoint = '/signed-envelopes';
        if (params) {
            const urlSearchParams = new URLSearchParams();
            Object.entries(params).forEach(([key, value]) => {
                urlSearchParams.append(key, value);
            });
            endpoint =
                urlSearchParams.toString().length > 0
                    ? endpoint + `?${urlSearchParams.toString()}`
                    : endpoint;
        }
        return this._makeRequest(endpoint, { method: 'GET' }).then((paginatedList) => {
            const { items } = paginatedList, rest = __rest(paginatedList, ["items"]);
            return Object.assign({ items: items.map((item) => (0, transformer_js_1.transformEnvelope)(item)) }, rest);
        });
    },
});
