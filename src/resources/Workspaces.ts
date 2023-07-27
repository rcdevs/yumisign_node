import YumiSign from 'yumisign';
import {YumiSignResource} from '../YumiSignResource.js';

export const Workspaces = YumiSignResource.extend({
  resourcePath: '/workspaces',

  list(): Promise<YumiSign.Response<YumiSign.Workspace[]>> {
    return this._makeRequest('', {
      method: 'GET',
    });
  },
} as YumiSign.WorkspacesResource);
