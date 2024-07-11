'use strict';

import {
  ResponseMock,
  TEST_ACCESS_TOKEN,
  TEST_BASE_URI,
  mockResource,
  mockYumiSign,
} from './mockery.js';
import {YumiSignError, YumiSignPermissionError} from '../src/Errors.js';
import {YumiSignResource} from '../src/YumiSignResource.js';
import {expect} from 'chai';

const yumisign = mockYumiSign();

const BASE_PATH = '/api/v1';
const RESOURCE_PATH = '/foo';
const REQUEST_INIT = {method: 'GET'};

describe('YumiSign Resource', () => {
  const createResources = (response?: (() => ResponseMock) | ResponseMock) =>
    mockResource(
      yumisign,
      YumiSignResource.extend({resourcePath: RESOURCE_PATH}),
      response
    );

  describe('_createUri', () => {
    const resources = createResources();

    it('Should add the base uri', () => {
      const uri = resources._createUri('');
      expect(uri.startsWith(TEST_BASE_URI)).to.be.true;
    });

    it('Should add the base path', () => {
      const uri = resources._createUri('');
      expect(uri.startsWith(`${TEST_BASE_URI}${BASE_PATH}`)).to.be.true;
    });

    it('Should add the resource path', () => {
      const uri = resources._createUri('');
      expect(uri.startsWith(`${TEST_BASE_URI}${BASE_PATH}${RESOURCE_PATH}`)).to
        .be.true;
    });

    it('Should add the endpoint', () => {
      const uri = resources._createUri('/{id}');
      expect(uri).to.equal(`${TEST_BASE_URI}${BASE_PATH}${RESOURCE_PATH}/{id}`);
    });

    it('Should keep a full uri', () => {
      const uri = resources._createUri('https://foo.com/bar');
      expect(uri).to.equal('https://foo.com/bar');
    });
  });

  describe('_addAuthorizationHeader', () => {
    const resources = createResources();

    it('Should add the authorization header', () => {
      const requestInit = resources._addAuthorizationHeader(REQUEST_INIT, {
        access_token: 'access_token',
        refresh_token: 'refresh_token',
        expires_in: 60 * 60,
        token_type: 'Bearer',
      });
      expect(requestInit).to.deep.equal({
        ...REQUEST_INIT,
        headers: {Authorization: 'Bearer access_token'},
      });
    });
  });

  describe('_request', () => {
    // @ts-ignore
    const resources = new (YumiSignResource.extend({
      resourcePath: RESOURCE_PATH,
    }))(yumisign) as YumiSignResourceObject;

    it('Should make a request with the provided uri and init', async () => {
      const requestUri = resources._createUri('');

      // @ts-ignore
      global.fetch = (uri, init) => {
        expect(uri).to.equal(requestUri);
        expect(init).to.include(REQUEST_INIT);
        return Promise.resolve();
      };

      await resources._request(requestUri, REQUEST_INIT);
    });

    it('Should timeout the request after specific duration', async () => {
      const requestUri = resources._createUri('');

      // @ts-ignore
      global.fetch = (uri, init) => {
        return new Promise((resolve, reject) => {
          setTimeout(() => {
            if (init?.signal && init.signal.aborted) {
              reject(new Error('AbortError'));
            } else {
              reject(new Error('Expected error is not thrown'));
            }
          }, 50); // Delay longer than the timeout
        });
      };

      try {
        await resources._request(requestUri, REQUEST_INIT, {timeout: 5});
        throw new Error('Expected request to timeout, but it did not');
      } catch (error) {
        expect(error instanceof Error && error.message === 'AbortError').to.be
          .true;
      }
    });
  });

  describe('_makeRequest', () => {
    it('Should make an authenticated request', async () => {
      const resources = createResources({body: {result: 'Success'}});
      const response = await resources._makeRequest('', REQUEST_INIT);
      expect(yumisign.LAST_REQUEST).to.deep.equal({
        method: 'GET',
        url: '/api/v1/foo',
        headers: {
          Authorization: `Bearer ${TEST_ACCESS_TOKEN}`,
        },
      });
      expect(response.result).to.equal('Success');
    });

    it('Should handle successful text responses', async () => {
      const resources = createResources({body: 'Success'});
      const response = await resources._makeRequest('', REQUEST_INIT);
      expect(response).to.equal('Success');
    });

    it('Should handle 401 error and retry with refreshed token', async () => {
      let requestCallCount = 0;

      const resources = createResources(() => {
        requestCallCount += 1;
        return requestCallCount === 1
          ? {status: 401}
          : {body: {result: 'Success'}};
      });

      yumisign.oauth = {
        refresh: () => {
          requestCallCount += 1;
          return Promise.resolve();
        },
        deauthorize: () => Promise.resolve(undefined),
      };

      const response = await resources._makeRequest('', REQUEST_INIT);
      expect(requestCallCount).to.equal(3);
      expect(response.result).to.equal('Success');
    });

    const errorTestCase = async (
      response: ResponseMock,
      errorClass: typeof YumiSignError,
      errorMessage?: string
    ) => {
      const resources = createResources(response);
      const error = await new Promise<Error>((resolve, reject) => {
        resources
          ._makeRequest('', REQUEST_INIT)
          .then(() => reject(new Error('Expected error is not thrown')))
          .catch((err) => resolve(err));
      });
      expect(error).to.be.instanceof(errorClass);
      if (errorMessage) {
        expect(error.message).to.equal(errorMessage);
      }
    };

    it('Should handle 403 error responses', () =>
      errorTestCase(
        {
          ok: false,
          status: 403,
          body: {error: {statusCode: 403, message: 'Forbidden'}},
        },
        YumiSignPermissionError
      ));

    it('Should handle non specific status error responses', () =>
      errorTestCase(
        {
          ok: false,
          status: 500,
          body: {error: {statusCode: 500, message: 'Internal server error'}},
        },
        YumiSignError
      ));

    it('Should handle non json error responses', () =>
      errorTestCase(
        {
          ok: false,
          status: 500,
          headers: {'Content-Type': 'text/plain'},
          body: '',
        },
        YumiSignError,
        'Unknown error'
      ));
  });
});
