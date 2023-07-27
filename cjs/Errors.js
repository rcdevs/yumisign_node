"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.YumiSignWebhookSignatureVerificationError = exports.YumiSignValidationError = exports.YumiSignPermissionError = exports.YumiSignAuthenticationError = exports.YumiSignError = void 0;
class YumiSignError extends Error {
    constructor(raw = { message: 'Unknown error' }) {
        super(raw.message);
        // @ts-ignore
        this.message = raw.message;
        this.type = this.constructor.name;
        this.raw = raw;
        this.code = raw.code;
        this.statusCode = raw.statusCode;
        this.violations = raw.violations;
    }
    static generate(raw) {
        switch (raw.code) {
            case 'AUTHENTICATION_REQUIRED':
                return new YumiSignAuthenticationError(raw);
            case 'VALIDATION_ERROR':
                return new YumiSignValidationError(raw);
            default:
                return new YumiSignError(raw);
        }
    }
}
exports.YumiSignError = YumiSignError;
class YumiSignAuthenticationError extends YumiSignError {
}
exports.YumiSignAuthenticationError = YumiSignAuthenticationError;
class YumiSignPermissionError extends YumiSignError {
}
exports.YumiSignPermissionError = YumiSignPermissionError;
class YumiSignValidationError extends YumiSignError {
}
exports.YumiSignValidationError = YumiSignValidationError;
class YumiSignWebhookSignatureVerificationError extends YumiSignError {
    constructor(header, payload, raw) {
        super(raw);
        this.header = header;
        this.payload = payload;
    }
}
exports.YumiSignWebhookSignatureVerificationError = YumiSignWebhookSignatureVerificationError;
