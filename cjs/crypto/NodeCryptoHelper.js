"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const CryptoHelper_js_1 = __importDefault(require("./CryptoHelper.js"));
const crypto_1 = require("crypto");
class NodeCryptoHelper extends CryptoHelper_js_1.default {
    computeHmacSignature(payload, secret) {
        return (0, crypto_1.createHmac)('sha256', secret)
            .update(payload, 'utf8')
            .digest('hex');
    }
}
exports.default = NodeCryptoHelper;
