"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const YumiSignResource = require('../yumisign.resource');
module.exports = YumiSignResource.extend({
    resourcePath: '/envelopes',
    retrieve(id, params) {
        return this._makeRequest({
            method: 'GET',
            url: `/${id}${(params === null || params === void 0 ? void 0 : params.session) ? '?session=1' : ''}`,
        });
    },
    list(ids) {
        return this._makeRequest({
            method: 'GET',
            data: { ids },
            // params: {ids},
            // headers: AxiosHeaders.from({'content-type': 'application/json'}),
            // data: JSON.stringify({ids}),
        });
    },
    create(params) {
        const data = new FormData();
        data.append('name', params.name);
        data.append('document', params.document, params.documentName);
        params.steps.forEach((step, stepIndex) => {
            data.append(`steps[${stepIndex}][type]`, step.type);
            step.recipients.forEach((recipient, recipientIndex) => {
                data.append(`steps[${stepIndex}][recipients][${recipientIndex}][name]`, recipient.name);
                data.append(`steps[${stepIndex}][recipients][${recipientIndex}][email]`, recipient.email);
            });
        });
        if (params.workspaceId)
            data.append('workspaceId', String(params.workspaceId));
        if (params.expiryDate)
            data.append('expiryDate', String(params.expiryDate));
        return this._makeRequest({
            method: 'POST',
            data,
        });
    },
    addDocument(id, params) {
        const data = new FormData();
        data.append('document', params.document, params.documentName);
        return this._makeRequest({
            method: 'POST',
            url: `/${id}/documents`,
            data,
        });
    },
    designerUri(id, params) {
        return new Promise((resolve, reject) => {
            this._makeRequest({
                method: 'GET',
                url: `/${id}/session`,
            })
                .then(({ designerUrl }) => {
                const url = new URL(designerUrl);
                if (params === null || params === void 0 ? void 0 : params.callback) {
                    url.searchParams.append('callback', encodeURI(params.callback));
                }
                if (params === null || params === void 0 ? void 0 : params.autoStart) {
                    url.searchParams.append('auto_start', '1');
                }
                resolve(url.toString());
            })
                .catch((error) => reject(error));
        });
    },
    start(id) {
        return this._makeRequest({
            method: 'PUT',
            url: `/${id}/start`,
        });
    },
});
