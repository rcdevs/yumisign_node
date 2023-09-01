/* eslint-disable camelcase */

'use strict';

import {YumiSignResource} from '../src/YumiSignResource';
import YumiSign = require('../src/yumisign.cjs.node.js');

type LastRequest = {
  method: string;
  url: string;
  headers?: Record<string, any>;
  body?: any;
};

type YumiSignMockObject = YumiSignObject & {
  STORED_OAUTH_TOKEN?: YumiSignOAuthToken;
  LAST_REQUEST?: LastRequest;
};

export const TEST_CLIENT_ID = 'test_client_id';
export const TEST_CLIENT_SECRET = 'test_client_secret';
export const TEST_ACCESS_TOKEN = 'test_access_token';
export const TEST_REFRESH_TOKEN = 'test_refresh_token';

export function mockYumiSign(): YumiSignMockObject {
  // @ts-ignore
  const yumisign = new YumiSign({
    clientId: TEST_CLIENT_ID,
    clientSecret: TEST_CLIENT_SECRET,
  });

  yumisign._oAuthToken = {
    access_token: TEST_ACCESS_TOKEN,
    refresh_token: TEST_REFRESH_TOKEN,
    expires_in: 60 * 60,
    token_type: 'Bearer',
  };

  yumisign.STORED_OAUTH_TOKEN = yumisign._oAuthToken;

  yumisign._config.oAuthTokenStore = {
    get: (): YumiSignOAuthToken | undefined => yumisign.STORED_OAUTH_TOKEN,
    set: (
      oAuthToken: Omit<YumiSignOAuthToken, 'refresh_token'> & {
        refresh_token?: string;
      }
    ) => {
      yumisign.STORED_OAUTH_TOKEN = oAuthToken;
    },
    del: () => {
      yumisign.STORED_OAUTH_TOKEN = undefined;
    },
  };

  return yumisign;
}

export function mockResource<T>(
  yumisign: YumiSignMockObject,
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  resource: any,
  response?: Record<string, unknown> | Array<any> | string,
  options?: {
    ok?: boolean;
    headers?: Record<string, string>;
    status?: number;
  }
): YumiSignResourceObject & T {
  // @ts-ignore
  return new ((resource as typeof YumiSignResource).extend({
    _request: (uri: string, init: RequestInit): Promise<Response> => {
      const ok = typeof options?.ok === 'boolean' ? options?.ok : true;
      const headers = options?.headers || {'Content-Type': 'application/json'};
      const status = options?.status || 200;

      const lastRequest: LastRequest = {
        method: init.method || 'POST',
        url: uri.replace(yumisign.getBaseUri(), ''),
      };

      if (init.headers) {
        lastRequest.headers = init.headers;
      }
      if (init.body) {
        if (init.body instanceof FormData) {
          const body: Record<string, unknown> = {};
          init.body.forEach((value, key) => (body[key] = value));
          lastRequest.body = body;
        } else {
          lastRequest.body = init.body;
        }
      }

      yumisign.LAST_REQUEST = lastRequest;

      // @ts-ignore
      return Promise.resolve({
        ok,
        headers: {
          has: (header: string): boolean =>
            Object.keys(headers).includes(header),
          get: (header: string): string => {
            if (Object.keys(headers).includes(header)) {
              return headers[header];
            }
            throw new Error('Header not found');
          },
        },
        status,
        json: () => Promise.resolve(response || {}),
        text: () => Promise.resolve(response || ''),
      });
    },
  }))(yumisign);
}
