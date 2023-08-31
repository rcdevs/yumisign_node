// @ts-nocheck

'use strict';

import {NodeCryptoHelper} from '../src/crypto/NodeCryptoHelper.js';
import {YumiSignWebhookSignatureVerificationError} from '../src/Errors.js';
import {expect} from 'chai';
import YumiSign = require('../src/yumisign.cjs.node.js');

const yumisign = new YumiSign();
const nodeCryptoHelper = new NodeCryptoHelper();

const PAYLOAD = {id: 'test_envelope_id'};
const PAYLOAD_STRING = JSON.stringify(PAYLOAD);
const SECRET = 'webhooks_test_secret';

const generateHeader = (
  options?: {payload?: string; timestamp?: number} = {}
): string => {
  const timestamp = options.timestamp || Math.floor(Date.now() / 1000);
  return [
    `t=${timestamp}`,
    `v1=${nodeCryptoHelper.computeHmacSignature(
      `${timestamp}.${options.payload || PAYLOAD_STRING}`,
      SECRET
    )}`,
  ].join(',');
};

describe('Webhooks', () => {
  describe('constructEvent', () => {
    it('Should return an event from valid JSON payload and header', () => {
      const header = generateHeader();
      const event = yumisign.webhooks.constructEvent(
        PAYLOAD_STRING,
        header,
        SECRET
      );

      expect(event.data.object.id).to.equal(PAYLOAD.id);
    });

    it('Should return an event from valid Uint8Array payload and header', () => {
      const header = generateHeader();
      const textEncoder = new TextEncoder();
      const event = yumisign.webhooks.constructEvent(
        textEncoder.encode(PAYLOAD_STRING),
        textEncoder.encode(header),
        SECRET
      );

      expect(event.data.object.id).to.equal(PAYLOAD.id);
    });

    it('Should raise a JSON error from invalid JSON payload', () => {
      const header = generateHeader({
        payload: '} Invalid JSON; FooBar][',
      });

      expect(() => {
        yumisign.webhooks.constructEvent(
          '} Invalid JSON; FooBar][',
          header,
          SECRET
        );
      }).to.throw(/Unexpected token/);
    });
  });

  describe('verifySignature', () => {
    it('Should throw an error from invalid payload', () => {
      const header = generateHeader();

      expect(() => {
        yumisign.webhooks.verifySignature(null, header, SECRET);
      }).to.throw(
        YumiSignWebhookSignatureVerificationError,
        /No webhook payload provided/
      );
      expect(() => {
        yumisign.webhooks.verifySignature(undefined, header, SECRET);
      }).to.throw(
        YumiSignWebhookSignatureVerificationError,
        /No webhook payload provided/
      );
      expect(() => {
        yumisign.webhooks.verifySignature('', header, SECRET);
      }).to.throw(
        YumiSignWebhookSignatureVerificationError,
        /No webhook payload provided/
      );
    });

    it('Should throw an error from invalid header', () => {
      expect(() => {
        yumisign.webhooks.verifySignature(PAYLOAD_STRING, null, SECRET);
      }).to.throw(
        YumiSignWebhookSignatureVerificationError,
        /No webhook header provided/
      );
      expect(() => {
        yumisign.webhooks.verifySignature(PAYLOAD_STRING, undefined, SECRET);
      }).to.throw(
        YumiSignWebhookSignatureVerificationError,
        /No webhook header provided/
      );
      expect(() => {
        yumisign.webhooks.verifySignature(PAYLOAD_STRING, '', SECRET);
      }).to.throw(
        YumiSignWebhookSignatureVerificationError,
        /No webhook header provided/
      );
      expect(() => {
        yumisign.webhooks.verifySignature(
          PAYLOAD_STRING,
          'invalid_header',
          SECRET
        );
      }).to.throw(
        YumiSignWebhookSignatureVerificationError,
        /Unable to extract timestamp and signatures from header/
      );
    });

    it('Should throw an error when the timestamp is not within the tolerance', () => {
      const header = generateHeader({
        timestamp: Date.now() / 1000 - 30,
      });

      expect(() => {
        yumisign.webhooks.verifySignature(PAYLOAD_STRING, header, SECRET, 15);
      }).to.throw(
        YumiSignWebhookSignatureVerificationError,
        /Timestamp outside the tolerance/
      );
    });

    it('Should throw an error when the header contain an invalid signature', () => {
      const header = generateHeader({
        payload: '{id: "bad_envelope_id"}',
      });

      expect(() => {
        yumisign.webhooks.verifySignature(PAYLOAD_STRING, header, SECRET);
      }).to.throw(
        YumiSignWebhookSignatureVerificationError,
        /Invalid signature/
      );
    });

    it('Should return true when the header contain a valid signature', () => {
      const header = generateHeader();

      expect(yumisign.webhooks.verifySignature(PAYLOAD_STRING, header, SECRET))
        .to.be.true;
    });
  });
});
