"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NodeCryptoHelper = void 0;
const CryptoHelper_js_1 = require("./CryptoHelper.js");
const crypto_1 = require("crypto");
class NodeCryptoHelper extends CryptoHelper_js_1.CryptoHelper {
    computeHmacSignature(payload, secret) {
        return (0, crypto_1.createHmac)('sha256', secret)
            .update(payload, 'utf8')
            .digest('hex');
    }
}
exports.NodeCryptoHelper = NodeCryptoHelper;
