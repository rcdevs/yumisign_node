import YumiSign from 'yumisign';
const YumiSignResource = require('../yumisign.resource');

module.exports = YumiSignResource.extend({
  resourcePath: '/workspaces',

  list(): Promise<YumiSign.Response<YumiSign.Workspace[]>> {
    return this._makeRequest({
      method: 'GET',
    });
  },
} as YumiSign.WorkspacesResource);
