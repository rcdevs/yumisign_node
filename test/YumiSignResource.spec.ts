// @ts-nocheck

'use strict';

import {YumiSignResource} from '../src/YumiSignResource.js';
import {expect} from 'chai';
import YumiSign = require('../src/yumisign.cjs.node.js');

const FAKE_BASE_URI = 'https://foo.com';
const BASE_PATH = '/api/v1';
const yumisign = new YumiSign({baseUri: FAKE_BASE_URI});

describe('YumiSign Resource', () => {
  const yumisignResource = new (YumiSignResource.extend({
    resourcePath: '/resources',
  }))(yumisign);

  describe('_createUri', () => {
    it('Should add the base uri', () => {
      const uri = yumisignResource._createUri('/{id}');
      expect(uri.startsWith(FAKE_BASE_URI)).to.be.true;
    });

    it('Should add the base path', () => {
      const uri = yumisignResource._createUri('/{id}');
      expect(uri.startsWith(`${FAKE_BASE_URI}${BASE_PATH}`)).to.be.true;
    });

    it('Should add the resource path', () => {
      const uri = yumisignResource._createUri('/{id}');
      expect(uri.startsWith(`${FAKE_BASE_URI}${BASE_PATH}/resources`)).to.be
        .true;
    });

    it('Should add the endpoint', () => {
      const uri = yumisignResource._createUri('/{id}');
      expect(uri).to.equal(`${FAKE_BASE_URI}${BASE_PATH}/resources/{id}`);
    });

    it('Should keep a full uri', () => {
      const uri = yumisignResource._createUri('https://foo.com/bar/{id}');
      expect(uri).to.equal('https://foo.com/bar/{id}');
    });
  });

  describe('_addAuthorizationHeader', () => {
    it('Should add the authorization header', () => {
      const requestInit = yumisignResource._addAuthorizationHeader(
        {},
        {token_type: 'Bearer', access_token: 'access_token'}
      );
      expect(requestInit).to.deep.equal({
        headers: {Authorization: 'Bearer access_token'},
      });
    });
  });
});
