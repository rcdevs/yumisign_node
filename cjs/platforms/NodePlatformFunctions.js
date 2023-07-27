"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NodePlatformFunctions = void 0;
const NodeCryptoHelper_js_1 = require("../crypto/NodeCryptoHelper.js");
const PlatformFunctions_js_1 = require("./PlatformFunctions.js");
class NodePlatformFunctions extends PlatformFunctions_js_1.PlatformFunctions {
    createCryptoHelper() {
        return new NodeCryptoHelper_js_1.NodeCryptoHelper();
    }
}
exports.NodePlatformFunctions = NodePlatformFunctions;
