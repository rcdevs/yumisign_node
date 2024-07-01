'use strict';

import {NodeCryptoHelper} from '../../src/crypto/NodeCryptoHelper.js';
import {NodePlatformFunctions} from '../../src/platforms/NodePlatformFunctions.js';
import {expect} from 'chai';

const nodePlatformFunctions = new NodePlatformFunctions();

describe('NodePlatformFunctions', () => {
  describe('createCryptoHelper', () => {
    it('Should return a NodeCryptoHelper instance', () => {
      expect(nodePlatformFunctions.createCryptoHelper()).to.be.an.instanceof(
        NodeCryptoHelper
      );
    });
  });
});
