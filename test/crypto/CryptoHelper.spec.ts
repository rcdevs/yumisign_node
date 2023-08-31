'use strict';

import {CryptoHelper} from '../../src/crypto/CryptoHelper.js';
import {expect} from 'chai';

const cryptoHelper = new CryptoHelper();

describe('CryptoHelper', () => {
  describe('computeHMACSignature', () => {
    it('Should throw an error', () => {
      expect(() => {
        cryptoHelper.computeHmacSignature('', '');
      }).to.throw(/computeHmacSignature not implemented/);
    });
  });
});
