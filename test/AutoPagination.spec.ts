// eslint-disable-next-line spaced-comment
///<reference path='../node_modules/@types/chai-as-promised/index.d.ts' />

'use strict';

import {YumiSignResource} from '../src/YumiSignResource.js';
import {expect} from 'chai';
import {makeAutoPaginationMethods} from '../src/AutoPagination.js';
import {mockYumiSign} from './mockery.js';

describe('Auto pagination', () => {
  const mockPagination = (
    pages?: Array<Array<any>>,
    options?: {limit?: number; page?: number}
  ) => {
    // @ts-ignore
    const resource = new YumiSignResource(mockYumiSign());
    const limit = options?.limit ?? pages?.[0]?.length ?? 0;
    const page = options?.page ?? 1;

    return makeAutoPaginationMethods(
      resource,
      Promise.resolve(
        pages
          ? {
              total: pages.flat().length,
              limit,
              pages: pages.length,
              items: pages[page - 1],
            }
          : ({} as any)
      ),
      (params) => {
        return Promise.resolve(
          pages
            ? {
                total: pages.flat().length,
                limit,
                pages: pages.length,
                items: pages[params.page - 1],
              }
            : ({} as any)
        );
      },
      {limit, page}
    );
  };

  it('Should throw an error for unsupported api response', () => {
    const paginator = mockPagination();
    return expect(paginator.next()).to.be.rejectedWith(
      /Unsupported api response/
    );
  });

  it('Should trow an error when the limit is greater than 100', () => {
    const pages = [['env_1', 'env_2'], ['env_3', 'env_4'], ['env_5']];
    return expect(
      new Promise((resolve, reject) => {
        try {
          mockPagination(pages, {limit: 101});
        } catch (err) {
          resolve((err as Error).message);
        }
        reject(new Error('Expected error is not throw'));
      })
    ).to.eventually.match(/You cannot specify a limit of more than 100 items/);
  });

  describe('each', () => {
    it('Should iterate properly when return false to break', () => {
      const pages = [['env_1', 'env_2'], ['env_3', 'env_4'], ['env_5']];
      const result = ['env_1', 'env_2', 'env_3', 'env_4'];
      const paginator = mockPagination(pages);
      return expect(
        new Promise((resolve, reject) => {
          const envelopeIds: any[] = [];
          return paginator
            .each((envelopeId) => {
              envelopeIds.push(envelopeId);
              if (envelopeId === 'env_4') {
                return false;
              } else {
                expect(envelopeIds.length).to.be.lessThan(result.length);
              }
            })
            .then(() => resolve(envelopeIds))
            .catch(reject);
        })
      ).to.eventually.deep.equal(result);
    });

    it('Should iterate properly when return a promise which return false to break', () => {
      const pages = [['env_1', 'env_2'], ['env_3', 'env_4'], ['env_5']];
      const result = ['env_1', 'env_2', 'env_3', 'env_4'];
      const paginator = mockPagination(pages);
      return expect(
        new Promise((resolve, reject) => {
          const envelopeIds: any[] = [];
          return paginator
            .each((envelopeId) => {
              envelopeIds.push(envelopeId);
              if (envelopeId === 'env_4') {
                return Promise.resolve(false);
              } else {
                expect(envelopeIds.length).to.be.lessThan(result.length);
                return Promise.resolve();
              }
            })
            .then(() => resolve(envelopeIds))
            .catch(reject);
        })
      ).to.eventually.deep.equal(result);
    });

    const eachTestCase = (
      pages: Array<Array<any>>,
      options?: {limit?: number; page?: number},
      result?: Array<any>
    ) => {
      const paginator = mockPagination(pages, options);

      return expect(
        new Promise((resolve, reject) => {
          const envelopeIds: any[] = [];
          return paginator
            .each((envelopeId) => {
              envelopeIds.push(envelopeId);
            })
            .then(() => resolve(envelopeIds))
            .catch(reject);
        })
      ).to.eventually.deep.equal(result ?? pages.flat());
    };

    it('Should iterate properly when last page is full', () => {
      return eachTestCase([
        ['env_1', 'env_2'],
        ['env_3', 'env_4'],
        ['env_5', 'env_6'],
        ['env_7', 'env_8'],
      ]);
    });

    it('Should iterate properly when last page is not full', () => {
      return eachTestCase([
        ['env_1', 'env_2'],
        ['env_3', 'env_4'],
        ['env_5', 'env_6'],
        ['env_7'],
      ]);
    });

    it('Should iterate properly when the total is shorter than page size', () => {
      return eachTestCase([['env_1', 'env_2', 'env_3', 'env_4', 'env_5']], {
        limit: 10,
      });
    });

    it('Should iterate properly when the start page is not the first', () => {
      const pages = [
        ['env_1', 'env_2'],
        ['env_3', 'env_4'],
        ['env_5', 'env_6'],
        ['env_7'],
      ];
      const result = [...pages].splice(1, pages.length - 1).flat();
      return eachTestCase(pages, {page: 2}, result);
    });
  });

  describe('toArray', () => {
    it('Should trow an error when the limit is greater than 1000', () => {
      const pages = [['env_1', 'env_2'], ['env_3', 'env_4'], ['env_5']];
      const paginator = mockPagination(pages);
      return expect(
        new Promise((resolve, reject) => {
          try {
            return paginator.toArray({limit: 1001});
          } catch (err) {
            resolve((err as Error).message);
          }
          reject(new Error('Expected error is not throw'));
        })
      ).to.eventually.match(
        /You cannot specify a limit of more than 1000 items/
      );
    });

    const toArrayTestCase = (
      pages: Array<Array<any>>,
      options?: {limit?: number; page?: number},
      limit?: number,
      result?: Array<any>
    ) => {
      const paginator = mockPagination(pages, options);

      return expect(
        new Promise((resolve, reject) => {
          return paginator
            .toArray({limit})
            .then((envelopeIds) => resolve(envelopeIds))
            .catch(reject);
        })
      ).to.eventually.deep.equal(result ?? pages.flat());
    };

    it('Should iterate properly when last limit is greater than items', () => {
      const pages = [['env_1', 'env_2'], ['env_3', 'env_4'], ['env_5']];
      return toArrayTestCase(pages, {}, pages.flat().length + 1);
    });

    it('Should iterate properly when last limit is lower than items', () => {
      const pages = [['env_1', 'env_2'], ['env_3', 'env_4'], ['env_5']];
      const result = ['env_1', 'env_2', 'env_3', 'env_4'];
      return toArrayTestCase(pages, {}, result.length, result);
    });

    it('Should iterate properly when the start page is not the first', () => {
      const pages = [['env_1', 'env_2'], ['env_3', 'env_4'], ['env_5']];
      const result = ['env_3', 'env_4', 'env_5'];
      return toArrayTestCase(pages, {page: 2}, undefined, result);
    });
  });

  describe('next', () => {
    it('Should iterate properly', async () => {
      const pages = [['env_1', 'env_2'], ['env_3'], []];
      const paginator = mockPagination(pages);
      expect(await paginator.next()).to.deep.equal({
        value: 'env_1',
        done: false,
      });
      expect(await paginator.next()).to.deep.equal({
        value: 'env_2',
        done: false,
      });
      expect(await paginator.next()).to.deep.equal({
        value: 'env_3',
        done: false,
      });
      expect(await paginator.next()).to.deep.equal({
        value: undefined,
        done: true,
      });
    });
  });

  describe('return', () => {
    it('Should return an empty object', () => {
      const pages = [['env_1', 'env_2'], ['env_3', 'env_4'], ['env_5']];
      const paginator = mockPagination(pages);
      return expect(
        new Promise((resolve, reject) => {
          const envelopeIds: any[] = [];
          paginator
            .next()
            .then((result) => {
              envelopeIds.push(result.value);
              expect(paginator.return()).to.deep.equal({});
            })
            .then(() => {
              resolve(envelopeIds);
            })
            .catch(reject);
        })
      ).to.eventually.deep.equal(pages.flat().slice(0, 1));
    });
  });

  describe('Async iteration', () => {
    it('Should iterate with `for await`', () => {
      const pages = [['env_1', 'env_2'], ['env_3', 'env_4'], ['env_5']];
      const paginator = mockPagination(pages);
      return expect(
        new Promise((resolve, reject) => {
          const forAwaitFn = async () => {
            const envelopeIds = [];
            // @ts-ignore
            for await (const envelopeId of paginator) {
              envelopeIds.push(envelopeId);
            }
            return envelopeIds;
          };

          forAwaitFn()
            .then((envelopeIds) => resolve(envelopeIds))
            .catch(reject);
        })
      ).to.eventually.deep.equal(pages.flat());
    });

    it('Should iterate with `for await` with break', () => {
      const pages = [['env_1', 'env_2'], ['env_3', 'env_4'], ['env_5']];
      const result = ['env_1', 'env_2', 'env_3', 'env_4'];
      const paginator = mockPagination(pages);
      return expect(
        new Promise((resolve, reject) => {
          const forAwaitFn = async () => {
            const envelopeIds = [];
            // @ts-ignore
            for await (const envelopeId of paginator) {
              envelopeIds.push(envelopeId);
              if (envelopeId === 'env_4') {
                break;
              }
            }
            return envelopeIds;
          };

          forAwaitFn()
            .then((envelopeIds) => resolve(envelopeIds))
            .catch(reject);
        })
      ).to.eventually.deep.equal(result);
    });

    it('Should iterate with `await` in `while` loop', () => {
      const pages = [['env_1', 'env_2'], ['env_3', 'env_4'], ['env_5']];
      const paginator = mockPagination(pages);
      return expect(
        new Promise((resolve, reject) => {
          const awaitFn = async () => {
            const envelopeIds = [];
            // eslint-disable-next-line no-constant-condition
            while (true) {
              // eslint-disable-next-line no-await-in-loop
              const {value: envelopeId, done} = await paginator.next();
              if (done) {
                break;
              }
              envelopeIds.push(envelopeId);
            }
            return envelopeIds;
          };

          awaitFn()
            .then((envelopeIds) => resolve(envelopeIds))
            .catch(reject);
        })
      ).to.eventually.deep.equal(pages.flat());
    });

    it('Should iterate with `await` in `while` loop with break', () => {
      const pages = [['env_1', 'env_2'], ['env_3', 'env_4'], ['env_5']];
      const result = ['env_1', 'env_2', 'env_3', 'env_4'];
      const paginator = mockPagination(pages);
      return expect(
        new Promise((resolve, reject) => {
          const awaitFn = async () => {
            const envelopeIds = [];
            // eslint-disable-next-line no-constant-condition
            while (true) {
              // eslint-disable-next-line no-await-in-loop
              const {value: envelopeId, done} = await paginator.next();
              if (done) {
                break;
              }
              envelopeIds.push(envelopeId);
              if (envelopeId === 'env_4') {
                break;
              }
            }
            return envelopeIds;
          };

          awaitFn()
            .then((envelopeIds) => resolve(envelopeIds))
            .catch(reject);
        })
      ).to.eventually.deep.equal(result);
    });
  });
});
