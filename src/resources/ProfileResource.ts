import YumiSign from 'yumisign';
const YumiSignResource = require('../yumisign.resource');

module.exports = YumiSignResource.extend({
  resourcePath: '/profile',

  retrieve(): Promise<YumiSign.Response<YumiSign.Profile>> {
    return this._makeRequest({method: 'GET'});
  },

  listSignedEnvelopes(
    params?: YumiSign.ProfileSignedEnvelopeListParams
  ): YumiSign.PaginatedListPromise<YumiSign.Envelope> {
    let url = '/signed-envelopes';
    if (params) {
      const urlSearchParams = new URLSearchParams();
      Object.entries(params).forEach(([key, value]) => {
        urlSearchParams.append(key, value);
      });
      url =
        urlSearchParams.toString().length > 0
          ? url + `?${urlSearchParams.toString()}`
          : url;
    }

    return this._makeRequest({
      method: 'GET',
      url,
    });
  },
} as YumiSign.ProfileResource);
