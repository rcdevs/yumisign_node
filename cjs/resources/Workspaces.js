"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Workspaces = void 0;
const YumiSignResource_js_1 = require("../YumiSignResource.js");
exports.Workspaces = YumiSignResource_js_1.YumiSignResource.extend({
    resourcePath: '/workspaces',
    list() {
        return this._makeRequest('', {
            method: 'GET',
        });
    },
});
