"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const YumiSignResource = require('../yumisign.resource');
module.exports = YumiSignResource.extend({
    resourcePath: '/profile',
    retrieve() {
        return this._makeRequest('', { method: 'GET' });
    },
});
