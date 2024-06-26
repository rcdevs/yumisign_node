'use strict';

import {TEST_BASE_URI, mockYumiSign} from './mockery.js';
import {YumiSignError, YumiSignPermissionError} from '../src/Errors.js';
import {YumiSignResource} from '../src/YumiSignResource.js';
import {expect} from 'chai';

const yumisign = mockYumiSign();

const BASE_PATH = '/api/v1';
const RESOURCE_PATH = '/foo';
const REQUEST_INIT = {method: 'GET'};

class ResponseMock {
  body: any;
  init: any;
  headers: any;

  constructor(body: any = null, init: any = {}) {
    this.body = body;
    this.init = init;
    this.headers = {
      _headers: init.headers || {},
      has(key: string) {
        return Object.prototype.hasOwnProperty.call(this._headers, key);
      },
      get(key: string) {
        return this.has(key) ? this._headers[key] : null;
      },
    };
  }

  json() {
    return Promise.resolve(
      typeof this.body === 'string' ? JSON.parse(this.body) : this.body
    );
  }

  text() {
    return Promise.resolve(
      typeof this.body === 'object' ? JSON.stringify(this.body) : this.body
    );
  }

  get status() {
    return this.init.status || 200;
  }

  get ok() {
    return this.status >= 200 && this.status < 300;
  }
}

describe('YumiSign Resource', () => {
  // @ts-ignore
  const yumisignResource = new (YumiSignResource.extend({
    resourcePath: RESOURCE_PATH,
  }))(yumisign) as YumiSignResourceObject;

  describe('_createUri', () => {
    it('Should add the base uri', () => {
      const uri = yumisignResource._createUri('');
      expect(uri.startsWith(TEST_BASE_URI)).to.be.true;
    });

    it('Should add the base path', () => {
      const uri = yumisignResource._createUri('');
      expect(uri.startsWith(`${TEST_BASE_URI}${BASE_PATH}`)).to.be.true;
    });

    it('Should add the resource path', () => {
      const uri = yumisignResource._createUri('');
      expect(uri.startsWith(`${TEST_BASE_URI}${BASE_PATH}${RESOURCE_PATH}`)).to
        .be.true;
    });

    it('Should add the endpoint', () => {
      const uri = yumisignResource._createUri('/{id}');
      expect(uri).to.equal(`${TEST_BASE_URI}${BASE_PATH}${RESOURCE_PATH}/{id}`);
    });

    it('Should keep a full uri', () => {
      const uri = yumisignResource._createUri('https://foo.com/bar');
      expect(uri).to.equal('https://foo.com/bar');
    });
  });

  describe('_addAuthorizationHeader', () => {
    it('Should add the authorization header', () => {
      const requestInit = yumisignResource._addAuthorizationHeader(
        REQUEST_INIT,
        {
          access_token: 'access_token',
          refresh_token: 'refresh_token',
          expires_in: 60 * 60,
          token_type: 'Bearer',
        }
      );
      expect(requestInit).to.deep.equal({
        ...REQUEST_INIT,
        headers: {Authorization: 'Bearer access_token'},
      });
    });
  });

  describe('_request', () => {
    it('Should make a fetch request with the provided uri and init', async () => {
      const requestUri = yumisignResource._createUri('');

      // @ts-ignore
      global.fetch = (uri, init) => {
        expect(uri).to.equal(requestUri);
        expect(init).to.deep.equal(REQUEST_INIT);
        return Promise.resolve(new ResponseMock());
      };

      await yumisignResource._request(requestUri, REQUEST_INIT);
    });
  });

  describe('_makeRequest', () => {
    it('Should make an authenticated request', async () => {
      // @ts-ignore
      yumisignResource._request = (uri: any, init: any) => {
        expect(init.headers).to.deep.equal({
          Authorization: `Bearer ${yumisign._oAuthToken?.access_token}`,
        });
        return Promise.resolve(
          new ResponseMock(JSON.stringify({result: 'Success'}), {
            status: 200,
            headers: {'Content-Type': 'application/json'},
          })
        );
      };

      const resource = await yumisignResource._makeRequest('', REQUEST_INIT);
      expect(resource.result).to.equal('Success');
    });

    it('Should handle successful text responses', async () => {
      yumisignResource._request = () =>
        // @ts-ignore
        Promise.resolve(new ResponseMock('Success', {status: 200}));

      const response = await yumisignResource._makeRequest('', REQUEST_INIT);
      expect(response).to.equal('Success');
    });

    it('Should handle 401 error and retry with refreshed token', async () => {
      let requestCallCount = 0;

      yumisign.oauth = {
        refresh: () => {
          requestCallCount += 1;
          return Promise.resolve();
        },
        deauthorize: () => Promise.resolve(undefined),
      };

      // @ts-ignore
      yumisignResource._request = (uri: any, init: any) => {
        requestCallCount += 1;
        if (requestCallCount === 1) {
          expect(init.headers).to.deep.equal({
            Authorization: `Bearer ${yumisign._oAuthToken?.access_token}`,
          });
          return Promise.resolve(new ResponseMock(null, {status: 401}));
        } else {
          expect(init.headers).to.deep.equal({
            Authorization: `Bearer ${yumisign._oAuthToken?.access_token}`,
          });
          return Promise.resolve(
            new ResponseMock(JSON.stringify({result: 'Success'}), {
              status: 200,
              headers: {'Content-Type': 'application/json'},
            })
          );
        }
      };

      const response = await yumisignResource._makeRequest('', REQUEST_INIT);
      expect(requestCallCount).to.equal(3);
      expect(response.result).to.equal('Success');
    });

    const errorTestCase = async (
      response: ResponseMock,
      errorClass: typeof YumiSignError,
      errorMessage?: string
    ) => {
      // @ts-ignore
      yumisignResource._request = () => Promise.resolve(response);

      const error = await new Promise<Error>((resolve, reject) => {
        yumisignResource
          ._makeRequest('', REQUEST_INIT)
          .then(() => reject(new Error('Expected error is not thrown')))
          .catch((err) => resolve(err));
      });
      expect(error).to.be.instanceof(errorClass);
      if (errorMessage) {
        expect(error.message).to.equal(errorMessage);
      }
    };

    it('Should handle 403 error responses', () => {
      const status = 403;
      const message = 'Forbidden';

      return errorTestCase(
        new ResponseMock(
          JSON.stringify({error: {statusCode: status, message}}),
          {status, headers: {'Content-Type': 'application/json'}}
        ),
        YumiSignPermissionError
      );
    });

    it('Should handle non specific status error responses', () => {
      const status = 500;
      const message = 'Internal server error';

      return errorTestCase(
        new ResponseMock(
          JSON.stringify({error: {statusCode: status, message}}),
          {status, headers: {'Content-Type': 'application/json'}}
        ),
        YumiSignError,
        message
      );
    });

    it('Should handle non json error responses', () => {
      return errorTestCase(
        new ResponseMock(null, {status: 500}),
        YumiSignError,
        'Unknown error'
      );
    });
  });
});
