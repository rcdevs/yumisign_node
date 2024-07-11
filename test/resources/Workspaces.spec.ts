'use strict';

import {TEST_ACCESS_TOKEN, mockResource, mockYumiSign} from '../mockery.js';
import {Workspaces} from '../../src/resources/Workspaces.js';
import YumiSign from 'yumisign';
import {expect} from 'chai';

const yumisign = mockYumiSign();

describe('Workspaces resource', () => {
  describe('list', () => {
    const workspacesResource = mockResource<YumiSign.WorkspacesResource>(
      yumisign,
      Workspaces,
      {body: [{id: 1}, {id: 2}]}
    );

    it('Sends the correct request', async () => {
      await workspacesResource.list();
      expect(yumisign.LAST_REQUEST).to.deep.equal({
        method: 'GET',
        url: '/api/v1/workspaces',
        headers: {
          Authorization: `Bearer ${TEST_ACCESS_TOKEN}`,
        },
      });
    });

    it('Should return workspaces', async () => {
      const workspaces = await workspacesResource.list();
      expect(workspaces).to.have.lengthOf(2);
      expect(workspaces[0].id).to.equal(1);
      expect(workspaces[1].id).to.equal(2);
    });
  });
});
