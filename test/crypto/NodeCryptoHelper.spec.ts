'use strict';

import {NodeCryptoHelper} from '../../src/crypto/NodeCryptoHelper.js';
import {expect} from 'chai';

const nodeCryptoHelper = new NodeCryptoHelper();

const SECRET = 'node_crypto_test_secret';

describe('NodeCryptoHelper', () => {
  describe('computeHMACSignature', () => {
    it('Should return a computed signature from empty payload', () => {
      expect(nodeCryptoHelper.computeHmacSignature('', SECRET)).to.equal(
        '56634ed35e5c565d6dc5afd3ed324c08692b06188e2dccfbd9f07faf23f3201a'
      );
    });

    it('Should return a computed signature from JSON payload', () => {
      expect(
        nodeCryptoHelper.computeHmacSignature(
          JSON.stringify({id: 'id', name: 'name'}),
          SECRET
        )
      ).to.equal(
        '4ea00d5cae42aa7c1e5baf1a7414b9ddc3db5803feaeacc00c8529676511137f'
      );
    });

    it('Should return a computed signature from UTF-8 payload', () => {
      expect(
        nodeCryptoHelper.computeHmacSignature('\ud83d\ude00', SECRET)
      ).to.equal(
        'b2fa21ee663fd98f9f2ff6b6903e5e7a9c4b21e1cae9e2917ba02d3eb50513c1'
      );
    });
  });
});
