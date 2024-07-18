'use strict';

import {
  TEST_CLIENT_ID,
  TEST_CLIENT_SECRET,
  TEST_REFRESH_TOKEN,
  mockResource,
  mockYumiSign,
} from '../mockery.js';
import {OAuth} from '../../src/resources/OAuth.js';
import YumiSign from 'yumisign';
import {expect} from 'chai';

const yumisign = mockYumiSign();

describe('OAuth resource', () => {
  describe('hasToken', () => {
    const oAuthResource = mockResource<YumiSign.OAuthResource>(yumisign, OAuth);
    const oAuthToken = yumisign._oAuthToken;

    it('Should return false', () => {
      yumisign._oAuthToken = undefined;
      expect(oAuthResource.hasToken()).to.be.false;
    });

    it('Should return true', () => {
      yumisign._oAuthToken = oAuthToken;
      expect(oAuthResource.hasToken()).to.be.true;
    });
  });

  describe('findStoredToken', () => {
    const oAuthResource = mockResource<YumiSign.OAuthResource>(yumisign, OAuth);
    const oAuthToken = yumisign.STORED_OAUTH_TOKEN;

    it('Should return undefined', async () => {
      yumisign.STORED_OAUTH_TOKEN = undefined;
      const storedOAuthToken = await oAuthResource.findStoredToken();
      expect(storedOAuthToken).to.be.undefined;
    });

    it('Should return the oAuth token', async () => {
      yumisign.STORED_OAUTH_TOKEN = oAuthToken;
      const storedOAuthToken = await oAuthResource.findStoredToken();
      expect(storedOAuthToken).to.deep.equal(oAuthToken);
    });
  });

  describe('authorizeUri', () => {
    const oAuthResource = mockResource<YumiSign.OAuthResource>(yumisign, OAuth);

    it('Should return the uri', () => {
      const authorizeUri = oAuthResource.authorizeUri({
        redirectUri: 'test_redirect_uri',
        state: 'test_state',
      });
      expect(authorizeUri).to.equal(
        `${yumisign.getBaseUri()}/integration-apps/authorize?client_id=${TEST_CLIENT_ID}&redirect_uri=test_redirect_uri&state=test_state&response_type=code`
      );
    });
  });

  describe('access', () => {
    const oAuthResource = mockResource<YumiSign.OAuthResource>(
      yumisign,
      OAuth,
      {
        body: {
          access_token: 'test_new_access_token',
          refresh_token: 'test_new_refresh_token',
          expires_in: 60 * 60,
          token_type: 'Bearer',
        },
      }
    );
    const params: YumiSign.OAuthAccessParams = {
      redirectUri: 'test_redirect_uri',
      code: 'test_code',
    };
    const oAuthToken = yumisign._oAuthToken;
    const storedOAuthToken = yumisign.STORED_OAUTH_TOKEN;

    it('Should send the correct request', async () => {
      await oAuthResource.access(params);
      expect(yumisign.LAST_REQUEST).to.deep.equal({
        method: 'POST',
        url: '/api/v1/OAuth/v2/access',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          client_id: TEST_CLIENT_ID,
          client_secret: TEST_CLIENT_SECRET,
          redirect_uri: params.redirectUri,
          code: params.code,
          grant_type: 'code',
        }),
      });
    });

    it('Should store and return an oAuth token', async () => {
      const expectedOAuthToken = {
        access_token: 'test_new_access_token',
        refresh_token: 'test_new_refresh_token',
        expires_in: 60 * 60,
        token_type: 'Bearer',
      };
      const actualOAuthToken = await oAuthResource.access(params);
      expect(actualOAuthToken).to.deep.equal(expectedOAuthToken);
      expect(yumisign._oAuthToken).to.deep.equal(expectedOAuthToken);
      expect(yumisign.STORED_OAUTH_TOKEN).to.deep.equal(expectedOAuthToken);
    });

    yumisign._oAuthToken = oAuthToken;
    yumisign.STORED_OAUTH_TOKEN = storedOAuthToken;
  });

  describe('refresh', () => {
    const oAuthResource = mockResource<YumiSign.OAuthResource>(
      yumisign,
      OAuth,
      {
        body: {
          access_token: 'test_new_access_token',
          refresh_token: 'test_new_refresh_token',
          expires_in: 60 * 60,
          token_type: 'Bearer',
        },
      }
    );
    const params: YumiSign.OAuthRefreshParams = {
      refreshToken: TEST_REFRESH_TOKEN,
    };
    const oAuthToken = yumisign._oAuthToken;
    const storedOAuthToken = yumisign.STORED_OAUTH_TOKEN;

    it('Should send the correct request', async () => {
      await oAuthResource.refresh(params);
      expect(yumisign.LAST_REQUEST).to.deep.equal({
        method: 'POST',
        url: '/api/v1/OAuth/v2/refresh',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          client_id: TEST_CLIENT_ID,
          client_secret: TEST_CLIENT_SECRET,
          refresh_token: params.refreshToken,
        }),
      });
    });

    it('Should store and return an oAuth token', async () => {
      const expectedOAuthToken = {
        access_token: 'test_new_access_token',
        refresh_token: 'test_new_refresh_token',
        expires_in: 60 * 60,
        token_type: 'Bearer',
      };
      const actualOAuthToken = await oAuthResource.refresh(params);
      expect(actualOAuthToken).to.deep.equal(expectedOAuthToken);
      expect(yumisign._oAuthToken).to.deep.equal(expectedOAuthToken);
      expect(yumisign.STORED_OAUTH_TOKEN).to.deep.equal(expectedOAuthToken);
    });

    yumisign._oAuthToken = oAuthToken;
    yumisign.STORED_OAUTH_TOKEN = storedOAuthToken;
  });

  describe('deauthorize', () => {
    const oAuthResource = mockResource<YumiSign.OAuthResource>(yumisign, OAuth);

    it('Should delete the oAuth token', async () => {
      await oAuthResource.deauthorize();
      expect(yumisign._oAuthToken).to.be.undefined;
      expect(yumisign.STORED_OAUTH_TOKEN).to.be.undefined;
    });
  });
});
