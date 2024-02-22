'use strict';

import {addQueryParams, stringifyQueryParams} from '../../src/utils/uri.js';
import {expect} from 'chai';

describe('URI', () => {
  describe('stringifyQueryParams', () => {
    const expectedQuery = (value: string): string =>
      encodeURIComponent(value)
        .replace(/%3D/g, '=')
        .replace(/%26/g, '&');

    it('Should handle simple types', () => {
      expect(
        stringifyQueryParams({
          a: 1,
          b: 'foo',
        })
      ).to.equal(expectedQuery('a=1&b=foo'));
    });

    it('Should handle deeply nested object', () => {
      expect(
        stringifyQueryParams({
          a: {b: {c: {d: 1}}},
        })
      ).to.equal(expectedQuery('a[b][c][d]=1'));
    });

    it('Should handle an arrays of simple types', () => {
      expect(
        stringifyQueryParams({
          a: ['b', 'c', 'd'],
        })
      ).to.equal(expectedQuery('a=b,c,d'));
    });

    it('Should handle an arrays of objects', () => {
      expect(
        stringifyQueryParams({
          a: [{b: 'c'}, {b: 'd'}],
        })
      ).to.equal(expectedQuery('a[0][b]=c&a[1][b]=d'));
    });

    it('Should handle indexed arrays', () => {
      expect(
        stringifyQueryParams({
          a: {
            0: {b: 'c'},
            1: {b: 'd'},
          },
        })
      ).to.equal(expectedQuery('a[0][b]=c&a[1][b]=d'));
    });
  });

  describe('addQueryParams', () => {
    it('Should handle empty params', () => {
      expect(addQueryParams('/foo', undefined)).to.equal('/foo');
      expect(addQueryParams('/foo', {})).to.equal('/foo');
    });

    it('Should handle non empty params', () => {
      expect(addQueryParams('/foo', {a: 'b'})).to.equal('/foo?a=b');
    });
  });
});
