declare module 'yumisign' {
  namespace YumiSign {
    export type YumiSignRawError = {
      message: string;
      code?: string;
      statusCode?: number;
      violations?: {[key: string]: string};
    };

    namespace Errors {
      class YumiSignError extends Error {
        /**
         * A human-readable message giving more details about the error. For card errors, these messages can
         * be shown to your users.
         */
        readonly message: string;

        readonly type:
          | 'YumiSignError'
          | 'YumiSignAuthenticationError'
          | 'YumiSignPermissionError'
          | 'YumiSignValidationError'
          | 'YumiSignWebhookSignatureVerificationError';

        readonly raw: unknown;

        /**
         * For card errors, a short string describing the kind of card error that occurred.
         */
        readonly code?: string;

        /**
         * Typically a 4xx or 5xx.
         */
        readonly statusCode?: number;

        /**
         * List of request data violations.
         */
        readonly violations?: {[key: string]: string};

        constructor(raw: YumiSignRawError);

        static generate(
          raw: YumiSignRawError & {code: 'AUTHENTICATION_REQUIRED'}
        ): YumiSignAuthenticationError;
        static generate(
          raw: YumiSignRawError & {code: 'VALIDATION_ERROR'}
        ): YumiSignValidationError;
        static generate(
          rawError: YumiSignRawError & {code: string}
        ): YumiSignError;
      }

      /**
       * Failure to properly authenticate yourself in the request.
       */
      class YumiSignAuthenticationError extends YumiSignError {
        readonly type: 'YumiSignAuthenticationError';
        readonly code: 'AUTHENTICATION_REQUIRED';
      }

      /**
       * Access was attempted on a resource that wasn't allowed.
       */
      class YumiSignPermissionError extends YumiSignError {
        readonly type: 'YumiSignPermissionError';
      }

      /**
       * Validation error arise when your request data are invalid.
       */
      class YumiSignValidationError extends YumiSignError {
        readonly type: 'YumiSignAuthenticationError';
        readonly code: 'VALIDATION_ERROR';
      }

      /**
       * Webhook signature verification failed.
       */
      class YumiSignWebhookSignatureVerificationError extends YumiSignError {
        readonly type: 'YumiSignWebhookSignatureVerificationError';
        readonly header: string | Uint8Array;
        readonly payload: string | Uint8Array;
      }
    }
  }
}
