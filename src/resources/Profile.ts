import {toAction, toEnvelope} from '../utils/converter.js';
import YumiSign from 'yumisign';
import {YumiSignResource} from '../YumiSignResource.js';
import {makeAutoPaginatePromise} from '../utils/pagination.js';

export const Profile = YumiSignResource.extend({
  resourcePath: '/profile',

  retrieve(): Promise<YumiSign.Response<YumiSign.Profile>> {
    return this._makeRequest('', {method: 'GET'});
  },

  listActions(
    params?: YumiSign.ProfileActionListParams
  ): YumiSign.PaginatedListPromise<YumiSign.Action> {
    const list = (
      params?: YumiSign.ProfileActionListParams
    ): Promise<YumiSign.Response<YumiSign.PaginatedList<YumiSign.Action>>> => {
      let endpoint = '/actions';
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

      return this._makeRequest<YumiSign.PaginatedList<YumiSign.Action>>(
        endpoint,
        {method: 'GET'}
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
    params?: YumiSign.ProfileSignedEnvelopeListParams
  ): YumiSign.PaginatedListPromise<YumiSign.Envelope> {
    const list = (
      params?: YumiSign.ProfileSignedEnvelopeListParams
    ): Promise<YumiSign.Response<
      YumiSign.PaginatedList<YumiSign.Envelope>
    >> => {
      let endpoint = '/signed-envelopes';
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

      return this._makeRequest<YumiSign.PaginatedList<YumiSign.Envelope>>(
        endpoint,
        {method: 'GET'}
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
