'use strict';

import {TEST_ACCESS_TOKEN, mockResource, mockYumiSign} from '../mockery.js';
import {Envelopes} from '../../src/resources/Envelopes.js';
import YumiSign from 'yumisign';
import {expect} from 'chai';

const yumisign = mockYumiSign();
describe('Envelopes resource', () => {
  describe('retrieve', () => {
    const envelopesResource = mockResource<YumiSign.EnvelopesResource>(
      yumisign,
      Envelopes,
      {id: 'env_1'}
    );

    it('Sends the correct request', async () => {
      await envelopesResource.retrieve('env_1');
      expect(yumisign.LAST_REQUEST).to.deep.equal({
        method: 'GET',
        url: '/api/v1/envelopes/env_1',
        headers: {
          Authorization: `Bearer ${TEST_ACCESS_TOKEN}`,
        },
      });
    });

    it('Should return an envelope', async () => {
      const envelope = await envelopesResource.retrieve('env_1');
      expect(envelope.id).to.equal('env_1');
    });
  });

  describe('list', () => {
    const envelopesResource = mockResource<YumiSign.EnvelopesResource>(
      yumisign,
      Envelopes,
      [
        {identifier: 'env_1', result: true, response: {id: 'env_1'}},
        {identifier: 'env_2', result: true, response: {id: 'env_2'}},
      ]
    );

    it('Sends the correct request', async () => {
      await envelopesResource.list(['env_1', 'env_2']);
      expect(yumisign.LAST_REQUEST).to.deep.equal({
        method: 'GET',
        url: '/api/v1/envelopes?ids[]=env_1&ids[]=env_2',
        headers: {
          Authorization: `Bearer ${TEST_ACCESS_TOKEN}`,
        },
      });
    });

    it('Should return bulk envelopes', async () => {
      const envelopes = await envelopesResource.list(['env_1', 'env_2']);
      expect(envelopes).to.have.lengthOf(2);
      expect(envelopes[0]?.response?.id).to.equal('env_1');
      expect(envelopes[1]?.response?.id).to.equal('env_2');
    });
  });
});
