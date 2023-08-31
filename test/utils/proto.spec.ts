'use strict';

import {expect} from 'chai';
import {extend} from '../../src/utils/proto.js';

describe('Proto', () => {
  describe('extend', () => {
    it('Provides an extension mechanism', () => {
      function A(): any {}
      A.extend = extend;

      const B = A.extend({
        constructor: function() {
          this.name = 'B';
        },
      });

      // @ts-ignore
      const bInstance = new B();
      expect(bInstance).to.be.an.instanceof(A);
      expect(bInstance).to.be.an.instanceof(B);
      expect(bInstance.name).to.equal('B');
      // @ts-ignore
      expect(B.extend === extend).to.equal(true);
    });
  });
});
