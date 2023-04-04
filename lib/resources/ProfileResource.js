"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const YumiSignResource = require('../yumisign.resource');
module.exports = YumiSignResource.extend({
    resourcePath: '/profile',
    retrieve() {
        return this._makeRequest({ method: 'GET' });
    },
    listSignedEnvelopes(params) {
        let url = '/signed-envelopes';
        if (params) {
            const urlSearchParams = new URLSearchParams();
            Object.entries(params).forEach(([key, value]) => {
                urlSearchParams.append(key, value);
            });
            url =
                urlSearchParams.toString().length > 0
                    ? url + `?${urlSearchParams.toString()}`
                    : url;
        }
        return this._makeRequest({
            method: 'GET',
            url,
        });
    },
});
