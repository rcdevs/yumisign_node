import { YumiSignResource } from '../YumiSignResource.js';
export const Workspaces = YumiSignResource.extend({
    resourcePath: '/workspaces',
    list() {
        return this._makeRequest('', {
            method: 'GET',
        });
    },
});
