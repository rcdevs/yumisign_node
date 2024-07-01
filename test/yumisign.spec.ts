// @ts-nocheck
/* eslint-disable new-cap */

'use strict';

import {TEST_CLIENT_ID} from './mockery.js';
import {expect} from 'chai';
import YumiSign = require('../src/yumisign.cjs.node.js');

class LocalStorageMock {
  private store: Record<string, string>;

  constructor() {
    this.store = {};
  }

  clear() {
    this.store = {};
  }

  getItem(key: string) {
    return this.store[key] || null;
  }

  setItem(key: string, value: string) {
    this.store[key] = value;
  }

  removeItem(key: string) {
    delete this.store[key];
  }
}

(global as unknown).localStorage = new LocalStorageMock();

describe('YumiSign', () => {
  describe('Object configuration', () => {
    it('Should only contain allowed properties', () => {
      expect(() => {
        YumiSign({
          foo: 'bar',
        });
      }).to.throw(/Configuration may only contain the properties:/);

      expect(() => {
        YumiSign({
          clientId: 'test_client_id',
          clientSecret: 'test_client_secret',
          baseUri: 'https://foo.bar.com',
          oAuthTokenStore: {},
        });
      }).to.not.throw();
    });
  });

  describe('Errors', () => {
    it('Should exports errors', () => {
      const yumisign = YumiSign();
      expect(yumisign?.errors).to.be.an('object');
    });
  });

  describe('Webhooks', () => {
    it('Should exports webhooks', () => {
      const yumisign = YumiSign();
      expect(yumisign?.webhooks).to.be.an('object');
    });
  });

  describe('_getClientId', () => {
    it('Should throw an error', () => {
      const yumisign = YumiSign();
      expect(() => {
        yumisign._getClientId();
      }).to.throw(/Client id not defined/);
    });

    it('Should return the client id', () => {
      const yumisign = YumiSign({clientId: 'test_client_id'});
      expect(yumisign._getClientId()).to.equal('test_client_id');
    });
  });

  describe('_getClientSecret', () => {
    it('Should throw an error', () => {
      const yumisign = YumiSign();
      expect(() => {
        yumisign._getClientSecret();
      }).to.throw(/Client secret not defined/);
    });

    it('Should return the client secret', () => {
      const yumisign = YumiSign({clientSecret: 'test_client_secret'});
      expect(yumisign._getClientSecret()).to.equal('test_client_secret');
    });
  });

  describe('_getOAuthToken', () => {
    it('Should throw an error', () => {
      const yumisign = YumiSign();
      expect(() => {
        yumisign._getOAuthToken();
      }).to.throw(/OAuth token not defined/);
    });

    it('Should return the oAuth token', () => {
      const yumisign = YumiSign();
      const oAuthToken = {
        access_token: 'access_token',
        refresh_token: 'refresh_token',
      };
      yumisign._oAuthToken = oAuthToken;
      expect(yumisign._getOAuthToken()).to.deep.equal(oAuthToken);
    });
  });

  describe('_setOAuthToken', () => {
    it('Should throw an error', () => {
      const yumisign = YumiSign();
      expect(() => {
        yumisign._setOAuthToken({access_token: 'access_token'});
      }).to.throw(/Refresh token not defined/);
    });

    it('Should save the oAuth token', () => {
      const yumisign = YumiSign();
      expect(() => {
        yumisign._setOAuthToken({
          access_token: 'access_token',
          refresh_token: 'refresh_token',
        });
      }).to.not.throw();

      expect(() => {
        yumisign._setOAuthToken({
          access_token: 'access_token',
        });
      }).to.not.throw();
    });
  });

  describe('_delOAuthToken', () => {
    it('Should delete the oAuth token', () => {
      const yumisign = YumiSign();
      yumisign._oAuthToken = {
        access_token: 'access_token',
        refresh_token: 'refresh_token',
      };
      yumisign._delOAuthToken();

      expect(yumisign._oAuthToken).to.be.undefined;
    });
  });

  describe('_getOAuthTokenStore', () => {
    it('Should return the oAuth token store', () => {
      const yumisign = YumiSign();
      const oAuthTokenStore = yumisign._getOAuthTokenStore();
      expect(oAuthTokenStore).to.have.keys(['get', 'set', 'del']);
      expect(oAuthTokenStore.get).to.be.a('function');
      expect(oAuthTokenStore.set).to.be.a('function');
      expect(oAuthTokenStore.del).to.be.a('function');
    });

    it('Should get an OAuth token from localStorage', () => {
      const yumisign = YumiSign({clientId: TEST_CLIENT_ID});
      const oAuthToken = {
        access_token: 'access_token',
        refresh_token: 'refresh_token',
      };

      localStorage.setItem(
        `yumisign_${TEST_CLIENT_ID}`,
        JSON.stringify(oAuthToken)
      );

      const oAuthTokenStore = yumisign._getOAuthTokenStore();
      expect(oAuthTokenStore.get()).to.deep.equal(oAuthToken);
    });

    it('Should set an OAuth token in localStorage with refresh token', () => {
      const yumisign = YumiSign({clientId: TEST_CLIENT_ID});
      const oAuthTokenStore = yumisign._getOAuthTokenStore();
      const oAuthToken = {
        access_token: 'access_token',
        refresh_token: 'refresh_token',
      };

      oAuthTokenStore.set(oAuthToken);
      const storedOAuthToken = JSON.parse(
        localStorage.getItem(`yumisign_${TEST_CLIENT_ID}`) || '{}'
      );
      expect(storedOAuthToken).to.deep.equal(oAuthToken);
    });

    it('Should set an OAuth token in localStorage without refresh token but use existing one', () => {
      const yumisign = YumiSign({clientId: TEST_CLIENT_ID});
      const initialOAuthToken = {
        access_token: 'initial_access_token',
        refresh_token: 'refresh_token',
      };

      localStorage.setItem(
        `yumisign_${TEST_CLIENT_ID}`,
        JSON.stringify(initialOAuthToken)
      );

      const oAuthTokenStore = yumisign._getOAuthTokenStore();
      const newOAuthToken = {
        access_token: 'new_access_token',
      };

      oAuthTokenStore.set(newOAuthToken);
      const storedOAuthToken = JSON.parse(
        localStorage.getItem(`yumisign_${TEST_CLIENT_ID}`) || '{}'
      );
      expect(storedOAuthToken).to.deep.equal({
        access_token: 'new_access_token',
        refresh_token: 'refresh_token',
      });
    });

    it('Should throw an error when setting an OAuth token without refresh token and no existing token', () => {
      const yumisign = YumiSign({clientId: TEST_CLIENT_ID});
      const oAuthTokenStore = yumisign._getOAuthTokenStore();
      const newOAuthToken = {
        access_token: 'new_access_token',
      };

      localStorage.removeItem(`yumisign_${TEST_CLIENT_ID}`);

      expect(() => {
        oAuthTokenStore.set(newOAuthToken);
      }).to.throw(/Refresh token not found/);
    });

    it('Should delete an OAuth token from localStorage', () => {
      const yumisign = YumiSign({clientId: TEST_CLIENT_ID});
      const oAuthTokenStore = yumisign._getOAuthTokenStore();

      oAuthTokenStore.del();
      expect(localStorage.getItem(`yumisign_${TEST_CLIENT_ID}`)).to.be.null;
    });
  });

  describe('Resources', () => {
    it('Should exports resources', () => {
      const yumisign = YumiSign();
      expect(yumisign?.envelopes).to.be.an('object');
      expect(yumisign?.oauth).to.be.an('object');
      expect(yumisign?.profile).to.be.an('object');
      expect(yumisign?.templates).to.be.an('object');
      expect(yumisign?.workspaces).to.be.an('object');
    });
  });
});
