import {toAction, toEnvelope} from '../utils/converter.js';
import YumiSign from 'yumisign';
import {YumiSignResource} from '../YumiSignResource.js';
import {addQueryParams} from '../utils/uri.js';
import {makeAutoPaginatePromise} from '../utils/pagination.js';

export const Profile = YumiSignResource.extend({
  resourcePath: '/profile',

  retrieve(
    options?: YumiSign.RequestOptions
  ): Promise<YumiSign.Response<YumiSign.Profile>> {
    return this._makeRequest('', {method: 'GET'}, options);
  },

  listActions(
    params?: YumiSign.ProfileActionListParams,
    options?: YumiSign.RequestOptions
  ): YumiSign.PaginatedListPromise<YumiSign.Action> {
    const list = (
      params?: YumiSign.ProfileActionListParams
    ): Promise<YumiSign.Response<YumiSign.PaginatedList<YumiSign.Action>>> => {
      const endpoint = addQueryParams('/actions', params);

      return this._makeRequest<YumiSign.PaginatedList<YumiSign.Action>>(
        endpoint,
        {method: 'GET'},
        options
      ).then((paginatedList) => {
        const {items, ...rest} = paginatedList;

        return {
          items: items.map((item) => toAction(item)),
          ...rest,
        };
      });
    };

    return makeAutoPaginatePromise<YumiSign.Action>(
      list(params),
      this,
      list,
      params
    );
  },

  listSignedEnvelopes(
    params?: YumiSign.ProfileSignedEnvelopeListParams,
    options?: YumiSign.RequestOptions
  ): YumiSign.PaginatedListPromise<YumiSign.Envelope> {
    const list = (
      params?: YumiSign.ProfileSignedEnvelopeListParams
    ): Promise<YumiSign.Response<
      YumiSign.PaginatedList<YumiSign.Envelope>
    >> => {
      const endpoint = addQueryParams('/signed-envelopes', params);

      return this._makeRequest<YumiSign.PaginatedList<YumiSign.Envelope>>(
        endpoint,
        {method: 'GET'},
        options
      ).then((paginatedList) => {
        const {items, ...rest} = paginatedList;

        return {
          items: items.map((item) => toEnvelope(item)),
          ...rest,
        };
      });
    };

    return makeAutoPaginatePromise<YumiSign.Envelope>(
      list(params),
      this,
      list,
      params
    );
  },
} as YumiSign.ProfileResource);
