'use strict';

import {WebPlatformFunctions} from '../../src/platforms/WebPlatformFunctions.js';
import {expect} from 'chai';

const webPlatformFunctions = new WebPlatformFunctions();

describe('PlatformFunctions', () => {
  describe('createCryptoHelper', () => {
    it('Should throw an error', () => {
      expect(() => {
        webPlatformFunctions.createCryptoHelper();
      }).to.throw(/createCryptoHelper not implemented/);
    });
  });
});
