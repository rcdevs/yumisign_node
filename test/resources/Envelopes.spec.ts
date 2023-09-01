'use strict';

import {TEST_ACCESS_TOKEN, mockResource, mockYumiSign} from '../mockery.js';
import {Envelopes} from '../../src/resources/Envelopes.js';
import YumiSign from 'yumisign';
import {expect} from 'chai';

const nodeVersion = parseInt(process.versions.node.split('.')[0], 10);

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

  describe('create', () => {
    if (nodeVersion < 18) {
      console.log(
        `Envelope create test skipped. Node version >=18 required, actual ${nodeVersion}.`
      );
      return Promise.resolve();
    }

    const envelopesResource = mockResource<YumiSign.EnvelopesResource>(
      yumisign,
      Envelopes,
      {id: 'env_1'}
    );
    const expiryDate = Math.floor(Date.now() / 1000);
    const params: YumiSign.EnvelopeCreateParams = {
      name: 'name',
      document: new Blob([''], {type: 'application/pdf'}),
      documentName: 'document_name',
      steps: [
        {
          recipients: [{name: 'John Doe', email: 'john.doe@example.com'}],
          type: 'sign',
        },
      ],
      workspaceId: 1,
      expiryDate: expiryDate,
      preferences: [
        {
          name: 'WorkflowNotificationCallbackUrlPreference',
          value: 'https://foo.com/bar',
        },
      ],
      metadata: {foo: 'bar'},
    };

    it('Sends the correct request', async () => {
      await envelopesResource.create(params);
      expect(yumisign.LAST_REQUEST?.body?.document).to.be.instanceof(Blob);
      delete yumisign.LAST_REQUEST?.body?.document;
      expect(yumisign.LAST_REQUEST).to.deep.equal({
        method: 'POST',
        url: '/api/v1/envelopes',
        headers: {
          Authorization: `Bearer ${TEST_ACCESS_TOKEN}`,
        },
        body: {
          name: 'name',
          'steps[0][recipients][0][name]': 'John Doe',
          'steps[0][recipients][0][email]': 'john.doe@example.com',
          'steps[0][type]': 'sign',
          workspaceId: '1',
          expiryDate: String(expiryDate),
          'preferences[0][name]': 'WorkflowNotificationCallbackUrlPreference',
          'preferences[0][value]': 'https://foo.com/bar',
          'metadata[foo]': 'bar',
        },
      });
    });

    it('Should return an envelope', async () => {
      const envelope = await envelopesResource.create(params);
      expect(envelope.id).to.equal('env_1');
    });
  });

  describe('addDocument', () => {
    if (nodeVersion < 18) {
      console.log(
        `Envelope addDocument test skipped. Node version >=18 required, actual ${nodeVersion}.`
      );
      return Promise.resolve();
    }

    const envelopesResource = mockResource<YumiSign.EnvelopesResource>(
      yumisign,
      Envelopes,
      {id: 'env_1'}
    );
    const params: YumiSign.EnvelopeAddDocumentParams = {
      document: new Blob([''], {type: 'application/pdf'}),
      documentName: 'document_name',
    };

    it('Sends the correct request', async () => {
      await envelopesResource.addDocument('env_1', params);
      expect(yumisign.LAST_REQUEST?.body?.document).to.be.instanceof(Blob);
      delete yumisign.LAST_REQUEST?.body?.document;
      expect(yumisign.LAST_REQUEST).to.deep.equal({
        method: 'POST',
        url: '/api/v1/envelopes/env_1/documents',
        headers: {
          Authorization: `Bearer ${TEST_ACCESS_TOKEN}`,
        },
        body: {},
      });
    });

    it('Should return an envelope', async () => {
      const envelope = await envelopesResource.addDocument('env_1', params);
      expect(envelope.id).to.equal('env_1');
    });
  });

  describe('designerUri', () => {
    const envelopesResource = mockResource<YumiSign.EnvelopesResource>(
      yumisign,
      Envelopes,
      {designerUrl: 'https://foo.com/bar'}
    );

    it('Sends the correct request', async () => {
      await envelopesResource.designerUri('env_1');
      expect(yumisign.LAST_REQUEST).to.deep.equal({
        method: 'GET',
        url: '/api/v1/envelopes/env_1/session',
        headers: {
          Authorization: `Bearer ${TEST_ACCESS_TOKEN}`,
        },
      });
    });

    it('Should return the uri', async () => {
      const designerUri = await envelopesResource.designerUri('env_1', {
        callback: 'https://bar.com/foo',
        autoStart: true,
      });
      expect(designerUri).to.equal(
        'https://foo.com/bar?callback=https%3A%2F%2Fbar.com%2Ffoo&auto_start=1'
      );
    });
  });

  describe('viewSignedUri', () => {
    const envelopesResource = mockResource<YumiSign.EnvelopesResource>(
      yumisign,
      Envelopes,
      {envelopeView: 'https://foo.com/bar'}
    );

    it('Sends the correct request', async () => {
      await envelopesResource.viewSignedUri('env_1');
      expect(yumisign.LAST_REQUEST).to.deep.equal({
        method: 'GET',
        url: '/api/v1/envelopes/env_1/session',
        headers: {
          Authorization: `Bearer ${TEST_ACCESS_TOKEN}`,
        },
      });
    });

    it('Should return the uri', async () => {
      const viewSignedUri = await envelopesResource.viewSignedUri('env_1');
      expect(viewSignedUri).to.equal('https://foo.com/bar');
    });
  });

  describe('start', () => {
    const envelopesResource = mockResource<YumiSign.EnvelopesResource>(
      yumisign,
      Envelopes,
      {id: 'env_1'}
    );

    it('Sends the correct request', async () => {
      await envelopesResource.start('env_1');
      expect(yumisign.LAST_REQUEST).to.deep.equal({
        method: 'PUT',
        url: '/api/v1/envelopes/env_1/start',
        headers: {
          Authorization: `Bearer ${TEST_ACCESS_TOKEN}`,
        },
      });
    });

    it('Should return an envelope', async () => {
      const envelope = await envelopesResource.start('env_1');
      expect(envelope.id).to.equal('env_1');
    });
  });
});
