export class YumiSignError extends Error {
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
export class YumiSignAuthenticationError extends YumiSignError {
}
export class YumiSignPermissionError extends YumiSignError {
}
export class YumiSignValidationError extends YumiSignError {
}
export class YumiSignWebhookSignatureVerificationError extends YumiSignError {
    constructor(header, payload, raw) {
        super(raw);
        this.header = header;
        this.payload = payload;
    }
}
