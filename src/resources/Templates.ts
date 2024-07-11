import {toEnvelope, toTemplate} from '../utils/converter.js';
import YumiSign from 'yumisign';
import {YumiSignResource} from '../YumiSignResource.js';
import {addQueryParams} from '../utils/uri.js';
import {makeAutoPaginatePromise} from '../utils/pagination.js';

export const Templates = YumiSignResource.extend({
  resourcePath: '',

  retrieve(
    workspaceId: number,
    id: number,
    options?: YumiSign.RequestOptions
  ): Promise<YumiSign.Response<YumiSign.Template>> {
    return this._makeRequest<YumiSign.Template>(
      `/workspaces/${workspaceId}/templates/${id}`,
      {method: 'GET'},
      options
    ).then((template) => toTemplate(template));
  },

  list(
    workspaceId: number,
    params?: YumiSign.TemplateListParams,
    options?: YumiSign.RequestOptions
  ): YumiSign.PaginatedListPromise<YumiSign.Template> {
    const list = (
      params?: YumiSign.TemplateListParams
    ): Promise<YumiSign.Response<
      YumiSign.PaginatedList<YumiSign.Template>
    >> => {
      const endpoint = addQueryParams(
        `/workspaces/${workspaceId}/templates`,
        params
      );

      return this._makeRequest<YumiSign.PaginatedList<YumiSign.Template>>(
        endpoint,
        {method: 'GET'},
        options
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
    params: YumiSign.TemplateUseParams,
    options?: YumiSign.RequestOptions
  ): Promise<YumiSign.Response<YumiSign.Envelope>> {
    return this._makeRequest<YumiSign.Envelope>(
      `/cloner/template/${id}/workflow`,
      {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(params),
      },
      options
    ).then((envelope) => toEnvelope(envelope));
  },
} as YumiSign.TemplatesResource);
