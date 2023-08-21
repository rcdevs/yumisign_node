import {transformEnvelope, transformTemplate} from '../utils/transformer.js';
import YumiSign from 'yumisign';
import {YumiSignResource} from '../YumiSignResource.js';

export const Templates = YumiSignResource.extend({
  resourcePath: '',

  retrieve(
    workspaceId: number,
    id: number
  ): Promise<YumiSign.Response<YumiSign.Template>> {
    return this._makeRequest<YumiSign.Template>(
      `/workspaces/${workspaceId}/templates/${id}`,
      {method: 'GET'}
    ).then((template) => transformTemplate(template));
  },

  list(
    workspaceId: number,
    params?: YumiSign.TemplateListParams
  ): YumiSign.PaginatedListPromise<YumiSign.Template> {
    let endpoint = `/workspaces/${workspaceId}/templates`;
    if (params) {
      const urlSearchParams = new URLSearchParams();
      Object.entries(params).forEach(([key, value]) => {
        urlSearchParams.append(key, value);
      });
      endpoint =
        urlSearchParams.toString().length > 0
          ? endpoint + `?${urlSearchParams.toString()}`
          : endpoint;
    }

    return this._makeRequest<YumiSign.PaginatedList<YumiSign.Template>>(
      endpoint,
      {method: 'GET'}
    ).then((paginatedList) => {
      const {items, ...rest} = paginatedList;
      return {
        items: items.map((item) => transformTemplate(item)),
        ...rest,
      };
    });
  },

  use(
    id: number,
    params?: YumiSign.TemplateUseParams
  ): Promise<YumiSign.Response<YumiSign.Envelope>> {
    return this._makeRequest<YumiSign.Envelope>(
      `/cloner/template/${id}/workflow`,
      {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: params ? JSON.stringify(params) : '{}',
      }
    ).then((envelope) => transformEnvelope(envelope));
  },
} as YumiSign.TemplatesResource);
