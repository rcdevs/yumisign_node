import YumiSign from 'yumisign';
import {YumiSignResource} from '../YumiSignResource.js';

export const Workspaces = YumiSignResource.extend({
  resourcePath: '/workspaces',

  list(
    options?: YumiSign.RequestOptions
  ): Promise<YumiSign.Response<YumiSign.Workspace[]>> {
    return this._makeRequest('', {method: 'GET'}, options);
  },
} as YumiSign.WorkspacesResource);
