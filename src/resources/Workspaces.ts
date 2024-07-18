import YumiSign from 'yumisign';
import {YumiSignResource} from '../YumiSignResource.js';

export const Workspaces = YumiSignResource.extend({
  resourcePath: '/workspaces',

  retrieve(
    id: number,
    options?: YumiSign.RequestOptions
  ): Promise<YumiSign.Response<YumiSign.Workspace>> {
    return this._makeRequest<YumiSign.Workspace>(
      `/${id}`,
      {method: 'GET'},
      options
    );
  },

  list(
    options?: YumiSign.RequestOptions
  ): Promise<YumiSign.Response<YumiSign.Workspace[]>> {
    return this._makeRequest<YumiSign.Workspace[]>(
      '',
      {method: 'GET'},
      options
    );
  },
} as YumiSign.WorkspacesResource);
