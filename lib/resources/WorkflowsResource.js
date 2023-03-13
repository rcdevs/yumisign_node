"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const YumiSignResource = require('../yumisign.resource');
module.exports = YumiSignResource.extend({
    resourcePath: '',
    retrieve(workspaceId, workflowId) {
        return this._makeRequest(`/workspaces/${workspaceId}/workflows/${workflowId}`, { method: 'GET' });
    },
    create(workspaceId, params) {
        const body = new FormData();
        body.append('name', params.name);
        body.append('document', params.file, params.filename);
        if (params.expiryDate)
            body.append('expiryDate', String(params.expiryDate));
        return this._makeRequest(`/workspaces/${workspaceId}/workflows`, {
            method: 'POST',
            body,
        });
    },
    update(workspaceId, workflowId, params) {
        const body = {};
        if (params.name)
            body.append('name', params.name);
        if (params.expiryDate)
            body.append('expiryDate', params.expiryDate);
        return this._makeRequest(`/workspaces/${workspaceId}/workflows/${workflowId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body),
        });
    },
    addRecipients(workspaceId, workflowId, params) {
        return this._makeRequest(`/workspaces/${workspaceId}/workflows/${workflowId}/recipients`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                steps: params.steps.map((step) => ({
                    recipients: step.recipients.map(({ name, email }) => ({ name, email })),
                    type: step.type,
                })),
            }),
        });
    },
});
