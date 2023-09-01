'use strict';

import {YumiSignResource} from '../../src/YumiSignResource.js';
import {expect} from 'chai';
import {makeAutoPaginatePromise} from '../../src/utils/pagination.js';

describe('Pagination', () => {
  describe('makeAutoPaginatePromise', () => {
    const promise = Promise.resolve({
      lastResponse: {
        headers: {},
        statusCode: 200,
      },
      total: 10,
      limit: 2,
      pages: 5,
      items: [{id: 1}, {id: 2}],
    });
    const resource = YumiSignResource;
    const request = () => {};

    it('Should append auto pagination methods', () => {
      const autoPaginatePromise = makeAutoPaginatePromise(
        promise,
        // @ts-ignore
        resource,
        request
      );

      expect(autoPaginatePromise.each).to.be.a('function');
      expect(autoPaginatePromise.toArray).to.be.a('function');
      expect(autoPaginatePromise.next).to.be.a('function');
      expect(autoPaginatePromise.return).to.be.a('function');
    });
  });
});
