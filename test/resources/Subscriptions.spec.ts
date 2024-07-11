'use strict';

import {TEST_ACCESS_TOKEN, mockResource, mockYumiSign} from '../mockery.js';
import {Subscriptions} from '../../src/resources/Subscriptions.js';
import YumiSign from 'yumisign';
import {expect} from 'chai';

const yumisign = mockYumiSign();
describe('Subscriptions resource', () => {
  describe('retrieve', () => {
    const subscriptionsResource = mockResource<YumiSign.SubscriptionsResource>(
      yumisign,
      Subscriptions,
      {body: {id: 1}}
    );

    it('Sends the correct request', async () => {
      await subscriptionsResource.retrieve(1);
      expect(yumisign.LAST_REQUEST).to.deep.equal({
        method: 'GET',
        url: '/api/v1/payments/subscriptions/1',
        headers: {
          Authorization: `Bearer ${TEST_ACCESS_TOKEN}`,
        },
      });
    });

    it('Should return a subscription', async () => {
      const envelope = await subscriptionsResource.retrieve(1);
      expect(envelope.id).to.equal(1);
    });
  });
});
