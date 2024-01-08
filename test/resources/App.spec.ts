'use strict';

import {TEST_ACCESS_TOKEN, mockResource, mockYumiSign} from '../mockery.js';
import {App} from '../../src/resources/App.js';
import YumiSign from 'yumisign';
import {expect} from 'chai';

const yumisign = mockYumiSign();
describe('Subscriptions resource', () => {
  describe('initialize', () => {
    const appResource = mockResource<YumiSign.AppResource>(yumisign, App, {
      profile: {id: 1},
      workspaces: [{id: 1}],
      currentSubscription: {id: 1},
    });

    it('Sends the correct request', async () => {
      await appResource.init({
        data: ['profile', 'workspaces', 'currentSubscription'],
      });
      expect(yumisign.LAST_REQUEST).to.deep.equal({
        method: 'GET',
        url:
          '/api/v1/app/initialize?data[]=profile&data[]=workspaces&data[]=currentSubscription',
        headers: {
          Authorization: `Bearer ${TEST_ACCESS_TOKEN}`,
        },
      });
    });

    it('Should return requested data', async () => {
      const response = await appResource.init({
        data: ['profile', 'workspaces', 'currentSubscription'],
      });
      expect(response.profile?.id).to.equal(1);
      expect((response.workspaces ?? [])[0]?.id).to.equal(1);
      expect(response.currentSubscription?.id).to.equal(1);
    });
  });
});
