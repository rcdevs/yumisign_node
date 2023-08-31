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

      expect(autoPaginatePromise.autoPagination).to.be.an('object');
      expect(autoPaginatePromise.autoPagination.each).to.be.a('function');
      expect(autoPaginatePromise.autoPagination.toArray).to.be.a('function');
      expect(autoPaginatePromise.autoPagination.next).to.be.a('function');
      expect(autoPaginatePromise.autoPagination.return).to.be.a('function');
    });
  });
});
