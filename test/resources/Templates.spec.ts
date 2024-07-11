'use strict';

import {TEST_ACCESS_TOKEN, mockResource, mockYumiSign} from '../mockery.js';
import {Templates} from '../../src/resources/Templates.js';
import YumiSign from 'yumisign';
import {expect} from 'chai';

const yumisign = mockYumiSign();

describe('Templates resource', () => {
  describe('retrieve', () => {
    const templatesResource = mockResource<YumiSign.TemplatesResource>(
      yumisign,
      Templates,
      {body: {id: 1}}
    );

    it('Sends the correct request', async () => {
      await templatesResource.retrieve(1, 1);
      expect(yumisign.LAST_REQUEST).to.deep.equal({
        method: 'GET',
        url: '/api/v1/workspaces/1/templates/1',
        headers: {
          Authorization: `Bearer ${TEST_ACCESS_TOKEN}`,
        },
      });
    });

    it('Should return a template', async () => {
      const template = await templatesResource.retrieve(1, 1);
      expect(template.id).to.equal(1);
    });
  });

  describe('list', () => {
    const templatesResource = mockResource<YumiSign.TemplatesResource>(
      yumisign,
      Templates,
      {
        body: {
          total: 2,
          limit: 2,
          pages: 1,
          items: [{id: 1}, {id: 2}],
        },
      }
    );
    const params: YumiSign.TemplateListParams = {page: 1, limit: 10};

    it('Sends the correct request', async () => {
      await templatesResource.list(1, params);
      expect(yumisign.LAST_REQUEST).to.deep.equal({
        method: 'GET',
        url: '/api/v1/workspaces/1/templates?page=1&limit=10',
        headers: {
          Authorization: `Bearer ${TEST_ACCESS_TOKEN}`,
        },
      });
    });

    it('Should return paginated templates', async () => {
      const templates = await templatesResource.list(1, params);
      expect(templates.items).to.have.lengthOf(2);
      expect(templates.items[0].id).to.equal(1);
      expect(templates.items[1].id).to.equal(2);
    });
  });

  describe('use', () => {
    const templatesResource = mockResource<YumiSign.TemplatesResource>(
      yumisign,
      Templates,
      {body: {id: 'env_1'}}
    );
    const params: YumiSign.TemplateUseParams = {
      name: 'tpl_name',
      recipients: [
        {name: 'rcp_name_1', email: 'rcp_email_1'},
        {name: 'rcp_name_2', email: 'rcp_email_2'},
      ],
      workspaceId: 1,
    };

    it('Sends the correct request', async () => {
      await templatesResource.use(1, params);
      expect(yumisign.LAST_REQUEST).to.deep.equal({
        method: 'POST',
        url: '/api/v1/cloner/template/1/workflow',
        headers: {
          Authorization: `Bearer ${TEST_ACCESS_TOKEN}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(params),
      });
    });

    it('Should return an envelope', async () => {
      const envelope = await templatesResource.use(1, params);
      expect(envelope.id).to.equal('env_1');
    });
  });
});
