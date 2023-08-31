'use strict';

import {PlatformFunctions} from '../../src/platforms/PlatformFunctions.js';
import {expect} from 'chai';

const platformFunctions = new PlatformFunctions();

describe('PlatformFunctions', () => {
  describe('createCryptoHelper', () => {
    it('Should throw an error', () => {
      expect(() => {
        platformFunctions.createCryptoHelper();
      }).to.throw(/createCryptoHelper not implemented/);
    });
  });
});
