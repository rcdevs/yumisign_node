import YumiSign from 'yumisign';
import {YumiSignResource} from '../YumiSignResource.js';

export const App = YumiSignResource.extend({
  resourcePath: '/app',

  init(
    params: YumiSign.AppInitializeParams,
    options?: YumiSign.RequestOptions
  ): Promise<YumiSign.Response<YumiSign.AppInitializeResponse>> {
    return this._makeRequest<YumiSign.AppInitializeResponse>(
      `/initialize?data[]=${params.data.join('&data[]=')}`,
      {method: 'GET'},
      options
    );
  },
} as YumiSign.AppResource);
