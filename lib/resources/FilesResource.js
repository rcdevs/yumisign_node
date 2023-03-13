"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const YumiSignResource = require('../yumisign.resource');
module.exports = YumiSignResource.extend({
    resourcePath: '',
    retrieve(uri) {
        return this._makeRequest(uri, { method: 'GET' });
    },
});
