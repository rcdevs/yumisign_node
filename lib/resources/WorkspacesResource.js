"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const YumiSignResource = require('../yumisign.resource');
module.exports = YumiSignResource.extend({
    resourcePath: '/workspaces',
    list() {
        return this._makeRequest({
            method: 'GET',
        });
    },
});
