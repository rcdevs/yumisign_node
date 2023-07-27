"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const NodeCryptoHelper_js_1 = __importDefault(require("../crypto/NodeCryptoHelper.js"));
const PlatformFunctions_js_1 = __importDefault(require("./PlatformFunctions.js"));
class NodePlatformFunctions extends PlatformFunctions_js_1.default {
    createCryptoHelper() {
        return new NodeCryptoHelper_js_1.default();
    }
}
exports.default = NodePlatformFunctions;
