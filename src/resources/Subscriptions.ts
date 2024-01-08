import YumiSign from 'yumisign';
import {YumiSignResource} from '../YumiSignResource.js';

export const Subscriptions = YumiSignResource.extend({
  resourcePath: '/payments/subscriptions',

  retrieve(id: number): Promise<YumiSign.Response<YumiSign.Subscription>> {
    return this._makeRequest<YumiSign.Subscription>(`/${id}`, {method: 'GET'});
  },
} as YumiSign.SubscriptionsResource);
