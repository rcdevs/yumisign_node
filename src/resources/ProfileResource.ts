import YumiSign from 'yumisign';
// eslint-disable-next-line sort-imports
import {transformAction, transformEnvelope} from '../utils/transformer';
const YumiSignResource = require('../yumisign.resource');

module.exports = YumiSignResource.extend({
  resourcePath: '/profile',

  retrieve(): Promise<YumiSign.Response<YumiSign.Profile>> {
    return this._makeRequest('', {method: 'GET'});
  },

  listActions(
    params?: YumiSign.ProfileActionListParams
  ): YumiSign.PaginatedListPromise<YumiSign.Action> {
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
        items: items.map((item) => transformAction(item)),
        ...rest,
      };
    });
  },

  listSignedEnvelopes(
    params?: YumiSign.ProfileSignedEnvelopeListParams
  ): YumiSign.PaginatedListPromise<YumiSign.Envelope> {
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
        items: items.map((item) => transformEnvelope(item)),
        ...rest,
      };
    });
  },
} as YumiSign.ProfileResource);
