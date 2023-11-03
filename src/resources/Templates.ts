import {toEnvelope, toTemplate} from '../utils/converter.js';
import YumiSign from 'yumisign';
import {YumiSignResource} from '../YumiSignResource.js';
import {makeAutoPaginatePromise} from '../utils/pagination.js';

export const Templates = YumiSignResource.extend({
  resourcePath: '',

  retrieve(
    workspaceId: number,
    id: number
  ): Promise<YumiSign.Response<YumiSign.Template>> {
    return this._makeRequest<YumiSign.Template>(
      `/workspaces/${workspaceId}/templates/${id}`,
      {method: 'GET'}
    ).then((template) => toTemplate(template));
  },

  list(
    workspaceId: number,
    params?: YumiSign.TemplateListParams
  ): YumiSign.PaginatedListPromise<YumiSign.Template> {
    const list = (
      params?: YumiSign.TemplateListParams
    ): Promise<YumiSign.Response<
      YumiSign.PaginatedList<YumiSign.Template>
    >> => {
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
          items: items.map((item) => toTemplate(item)),
          ...rest,
        };
      });
    };

    return makeAutoPaginatePromise<YumiSign.Template>(
      list(params),
      this,
      list,
      params
    );
  },

  use(
    id: number,
    params: YumiSign.TemplateUseParams
  ): Promise<YumiSign.Response<YumiSign.Envelope>> {
    return this._makeRequest<YumiSign.Envelope>(
      `/cloner/template/${id}/workflow`,
      {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(params),
      }
    ).then((envelope) => toEnvelope(envelope));
  },
} as YumiSign.TemplatesResource);
