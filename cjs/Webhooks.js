"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createWebhooks = void 0;
const Errors_js_1 = require("./Errors.js");
function createWebhooks(platformFunctions) {
    function parseHeader(header) {
        return header.split(',').reduce((acc, item) => {
            const kv = item.split('=');
            if (kv[0] === 't') {
                acc.timestamp = parseInt(kv[1], 10);
            }
            if (kv[0] === 'v1') {
                acc.signature = kv[1];
            }
            return acc;
        }, {
            timestamp: -1,
            signature: '',
        });
    }
    function verifySignature(encodedPayload, encodedHeader, secret, tolerance, receivedAt) {
        if (!encodedPayload) {
            throw new Errors_js_1.YumiSignWebhookSignatureVerificationError(encodedHeader, encodedPayload, { message: 'No webhook payload provided.' });
        }
        if (!encodedHeader || encodedHeader === '') {
            throw new Errors_js_1.YumiSignWebhookSignatureVerificationError(encodedHeader, encodedPayload, { message: 'No webhook header provided.' });
        }
        const textDecoder = new TextDecoder('utf8');
        const decodedPayload = encodedPayload instanceof Uint8Array
            ? textDecoder.decode(encodedPayload)
            : encodedPayload;
        const decodedHeader = encodedHeader instanceof Uint8Array
            ? textDecoder.decode(encodedHeader)
            : encodedHeader;
        const { timestamp: receivedTimestamp, signature: receivedSignature, } = parseHeader(decodedHeader);
        if (receivedTimestamp === -1 || receivedSignature === '') {
            throw new Errors_js_1.YumiSignWebhookSignatureVerificationError(decodedHeader, decodedPayload, { message: 'Unable to extract timestamp and signatures from header.' });
        }
        const timestampAge = Math.floor((typeof receivedAt === 'number' ? receivedAt : Date.now()) / 1000) - receivedTimestamp;
        if (tolerance > 0 && timestampAge > tolerance) {
            throw new Errors_js_1.YumiSignWebhookSignatureVerificationError(decodedHeader, decodedPayload, { message: 'Timestamp outside the tolerance.' });
        }
        const cryptoHelper = platformFunctions.createCryptoHelper();
        const expectedSignature = cryptoHelper.computeHmacSignature(`${receivedTimestamp}.${decodedPayload}`, secret);
        if (receivedSignature !== expectedSignature) {
            throw new Errors_js_1.YumiSignWebhookSignatureVerificationError(decodedHeader, decodedPayload, { message: 'Invalid signature.' });
        }
        return true;
    }
    function constructEvent(payload, header, secret, tolerance, receivedAt) {
        verifySignature(payload, header, secret, tolerance !== null && tolerance !== void 0 ? tolerance : 10 * 60, receivedAt);
        const jsonPayload = payload instanceof Uint8Array
            ? JSON.parse(new TextDecoder('utf8').decode(payload))
            : JSON.parse(payload);
        return {
            type: 'envelope.updated',
            data: {
                type: 'envelope',
                object: jsonPayload,
            },
        };
    }
    return {
        constructEvent,
        verifySignature,
    };
}
exports.createWebhooks = createWebhooks;
