export class YumiSignError extends Error {
  readonly message: string;
  readonly type: string;
  readonly raw: unknown;

  readonly code?: string;
  readonly statusCode?: number;

  constructor(
    raw: YumiSignRawError = {message: 'Unknown error'},
    type = 'YumiSignError'
  ) {
    super(raw.message);
    this.message = raw.message;
    this.type = type;

    this.raw = raw;
    this.code = raw.code;
    this.statusCode = raw.statusCode;
  }

  static generate(raw: YumiSignRawError): YumiSignError {
    switch (raw.code) {
      case 'AUTHENTICATION_REQUIRED':
        return new YumiSignAuthenticationError(raw);
      case 'UNAUTHORIZED_TO_PERFORM_THIS_ACTION':
        return new YumiSignPermissionError(raw);
      case 'VALIDATION_ERROR':
        return new YumiSignValidationError(raw);
      default:
        return new YumiSignError(raw);
    }
  }
}

export class YumiSignAuthenticationError extends YumiSignError {
  constructor(raw: YumiSignRawError = {message: 'Authentication error'}) {
    super(raw, 'YumiSignAuthenticationError');
  }
}

export class YumiSignPermissionError extends YumiSignError {
  constructor(raw: YumiSignRawError = {message: 'Permission error'}) {
    super(raw, 'YumiSignPermissionError');
  }
}

export class YumiSignValidationError extends YumiSignError {
  readonly violations?: {[key: string]: string};

  constructor(raw: YumiSignRawError = {message: 'Validation error'}) {
    super(raw, 'YumiSignValidationError');
    this.violations = raw.violations;
  }
}

export class YumiSignWebhookSignatureVerificationError extends YumiSignError {
  header: string | Uint8Array;
  payload: string | Uint8Array;

  constructor(
    header: string | Uint8Array,
    payload: string | Uint8Array,
    raw: YumiSignRawError = {message: 'Webhook signature verification error'}
  ) {
    super(raw, 'YumiSignWebhookSignatureVerificationError');
    this.header = header;
    this.payload = payload;
  }
}
