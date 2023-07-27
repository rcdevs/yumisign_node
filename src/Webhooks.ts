import {PlatformFunctions} from './platforms/PlatformFunctions.js';
import {YumiSignWebhookSignatureVerificationError} from './Errors.js';

export function createWebhooks(
  platformFunctions: PlatformFunctions
): YumiSignWebhookObject {
  function parseHeader(header: string): {timestamp: number; signature: string} {
    return header.split(',').reduce<{timestamp: number; signature: string}>(
      (acc, item) => {
        const kv = item.split('=');

        if (kv[0] === 't') {
          acc.timestamp = parseInt(kv[1], 10);
        }

        if (kv[0] === 'v1') {
          acc.signature = kv[1];
        }

        return acc;
      },
      {
        timestamp: -1,
        signature: '',
      }
    );
  }

  function verifySignature(
    encodedPayload: string | Uint8Array,
    encodedHeader: string | Uint8Array,
    secret: string,
    tolerance: number,
    receivedAt?: number
  ): boolean {
    if (!encodedPayload) {
      throw new YumiSignWebhookSignatureVerificationError(
        encodedHeader,
        encodedPayload,
        {message: 'No webhook payload provided.'}
      );
    }

    if (!encodedHeader || encodedHeader === '') {
      throw new YumiSignWebhookSignatureVerificationError(
        encodedHeader,
        encodedPayload,
        {message: 'No webhook header provided.'}
      );
    }

    const textDecoder = new TextDecoder('utf8');

    const decodedPayload =
      encodedPayload instanceof Uint8Array
        ? textDecoder.decode(encodedPayload)
        : encodedPayload;

    const decodedHeader =
      encodedHeader instanceof Uint8Array
        ? textDecoder.decode(encodedHeader)
        : encodedHeader;

    const {
      timestamp: receivedTimestamp,
      signature: receivedSignature,
    } = parseHeader(decodedHeader);

    if (receivedTimestamp === -1 || receivedSignature === '') {
      throw new YumiSignWebhookSignatureVerificationError(
        decodedHeader,
        decodedPayload,
        {message: 'Unable to extract timestamp and signatures from header.'}
      );
    }

    const timestampAge =
      Math.floor(
        (typeof receivedAt === 'number' ? receivedAt : Date.now()) / 1000
      ) - receivedTimestamp;

    if (tolerance > 0 && timestampAge > tolerance) {
      throw new YumiSignWebhookSignatureVerificationError(
        decodedHeader,
        decodedPayload,
        {message: 'Timestamp outside the tolerance.'}
      );
    }

    const cryptoHelper = platformFunctions.createCryptoHelper();
    const expectedSignature = cryptoHelper.computeHmacSignature(
      `${receivedTimestamp}.${decodedPayload}`,
      secret
    );

    if (receivedSignature !== expectedSignature) {
      throw new YumiSignWebhookSignatureVerificationError(
        decodedHeader,
        decodedPayload,
        {message: 'Invalid signature.'}
      );
    }

    return true;
  }

  function constructEvent(
    payload: string | Uint8Array,
    header: string | Uint8Array,
    secret: string,
    tolerance?: number,
    receivedAt?: number
  ): YumiSignEvent {
    verifySignature(payload, header, secret, tolerance ?? 10 * 60, receivedAt);
    const jsonPayload =
      payload instanceof Uint8Array
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
