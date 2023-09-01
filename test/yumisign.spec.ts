// @ts-nocheck
/* eslint-disable new-cap */

'use strict';

import {expect} from 'chai';
import YumiSign = require('../src/yumisign.cjs.node.js');

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
      expect(yumisign._getOAuthTokenStore()).to.have.keys([
        'get',
        'set',
        'del',
      ]);
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
