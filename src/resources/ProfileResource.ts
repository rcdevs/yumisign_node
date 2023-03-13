import YumiSign from 'yumisign';
const YumiSignResource = require('../yumisign.resource');

module.exports = YumiSignResource.extend({
  resourcePath: '/profile',

  retrieve(): Promise<YumiSign.Response<YumiSign.Profile>> {
    return this._makeRequest('', {method: 'GET'});
  },
} as YumiSign.ProfileResource);
