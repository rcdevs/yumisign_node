import YumiSign from 'yumisign';
const YumiSignResource = require('../yumisign.resource');

module.exports = YumiSignResource.extend({
  resourcePath: '/profile',

  retrieve(): Promise<YumiSign.Response<YumiSign.Profile>> {
    return this._makeRequest('', {method: 'GET'});
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

    return this._makeRequest(endpoint, {method: 'GET'});
  },
} as YumiSign.ProfileResource);
