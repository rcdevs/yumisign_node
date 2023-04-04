"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const YumiSignResource = require('../yumisign.resource');
module.exports = YumiSignResource.extend({
    resourcePath: '/envelopes',
    retrieve(id, params) {
        return this._makeRequest(`/${id}${(params === null || params === void 0 ? void 0 : params.session) ? '?session=1' : ''}`, {
            method: 'GET',
        });
    },
    list(ids) {
        return this._makeRequest(`?ids[]=${ids.join('&ids[]=')}`, {
            method: 'GET',
        });
    },
    create(params) {
        const body = new FormData();
        body.append('name', params.name);
        body.append('document', params.document, params.documentName);
        params.steps.forEach((step, stepIndex) => {
            body.append(`steps[${stepIndex}][type]`, step.type);
            step.recipients.forEach((recipient, recipientIndex) => {
                body.append(`steps[${stepIndex}][recipients][${recipientIndex}][name]`, recipient.name);
                body.append(`steps[${stepIndex}][recipients][${recipientIndex}][email]`, recipient.email);
            });
        });
        if (params.workspaceId)
            body.append('workspaceId', String(params.workspaceId));
        if (params.expiryDate)
            body.append('expiryDate', String(params.expiryDate));
        return this._makeRequest('', {
            method: 'POST',
            body,
        });
    },
    addDocument(id, params) {
        const body = new FormData();
        body.append('document', params.document, params.documentName);
        return this._makeRequest(`/${id}/documents`, {
            method: 'POST',
            body,
        });
    },
    designerUri(id, params) {
        return new Promise((resolve, reject) => {
            this._makeRequest(`/${id}/session`, { method: 'GET' })
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
        return this._makeRequest(`/${id}/start`, {
            method: 'PUT',
        });
    },
});
