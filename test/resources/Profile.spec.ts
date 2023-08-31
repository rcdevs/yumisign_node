'use strict';

import {TEST_ACCESS_TOKEN, mockResource, mockYumiSign} from '../mockery.js';
import {Profile} from '../../src/resources/Profile.js';
import YumiSign from 'yumisign';
import {expect} from 'chai';

const yumisign = mockYumiSign();

describe('Profile resource', () => {
  describe('retrieve', () => {
    const profileResource = mockResource<YumiSign.ProfileResource>(
      yumisign,
      Profile,
      {id: 1}
    );

    it('Sends the correct request', async () => {
      await profileResource.retrieve();
      expect(yumisign.LAST_REQUEST).to.deep.equal({
        method: 'GET',
        url: '/api/v1/profile',
        headers: {
          Authorization: `Bearer ${TEST_ACCESS_TOKEN}`,
        },
      });
    });

    it('Should return a template', async () => {
      const profile = await profileResource.retrieve();
      expect(profile.id).to.equal(1);
    });
  });

  describe('listActions', () => {
    const profileResource = mockResource<YumiSign.ProfileResource>(
      yumisign,
      Profile,
      {
        total: 2,
        limit: 2,
        pages: 1,
        items: [
          {id: 1, envelope: {id: 1}},
          {id: 2, envelope: {id: 2}},
        ],
      }
    );

    it('Sends the correct request', async () => {
      await profileResource.listActions();
      expect(yumisign.LAST_REQUEST).to.deep.equal({
        method: 'GET',
        url: '/api/v1/profile/actions',
        headers: {
          Authorization: `Bearer ${TEST_ACCESS_TOKEN}`,
        },
      });
    });

    it('Should return paginated actions', async () => {
      const actions = await profileResource.listActions();
      expect(actions.items).to.have.lengthOf(2);
      expect(actions.items[0].id).to.equal(1);
      expect(actions.items[1].id).to.equal(2);
    });
  });

  describe('listSignedEnvelopes', () => {
    const profileResource = mockResource<YumiSign.ProfileResource>(
      yumisign,
      Profile,
      {
        total: 2,
        limit: 2,
        pages: 1,
        items: [{id: 1}, {id: 2}],
      }
    );

    it('Sends the correct request', async () => {
      await profileResource.listSignedEnvelopes();
      expect(yumisign.LAST_REQUEST).to.deep.equal({
        method: 'GET',
        url: '/api/v1/profile/signed-envelopes',
        headers: {
          Authorization: `Bearer ${TEST_ACCESS_TOKEN}`,
        },
      });
    });

    it('Should return paginated envelopes', async () => {
      const envelopes = await profileResource.listSignedEnvelopes();
      expect(envelopes.items).to.have.lengthOf(2);
      expect(envelopes.items[0].id).to.equal(1);
      expect(envelopes.items[1].id).to.equal(2);
    });
  });
});
