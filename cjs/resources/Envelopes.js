"use strict";
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Envelopes = void 0;
const YumiSignResource_js_1 = require("../YumiSignResource.js");
const transformer_js_1 = require("../utils/transformer.js");
exports.Envelopes = YumiSignResource_js_1.YumiSignResource.extend({
    resourcePath: '/envelopes',
    retrieve(id, params) {
        return this._makeRequest(`/${id}${(params === null || params === void 0 ? void 0 : params.session) ? '?session=1' : ''}`, { method: 'GET' }).then((envelope) => (0, transformer_js_1.transformEnvelope)(envelope));
    },
    list(ids) {
        return this._makeRequest(`?ids[]=${ids.join('&ids[]=')}`, { method: 'GET' }).then((bulkItems) => bulkItems.map((bulkItem) => {
            const { response } = bulkItem, rest = __rest(bulkItem, ["response"]);
            return Object.assign({ response: response ? (0, transformer_js_1.transformEnvelope)(response) : response }, rest);
        }));
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
        if (params.preferences) {
            params.preferences.forEach((preference, preferenceIndex) => {
                body.append(`preferences[${preferenceIndex}][name]`, preference.name);
                body.append(`preferences[${preferenceIndex}][value]`, String(preference.value));
            });
        }
        if (params.metadata) {
            Object.keys(params.metadata).forEach((metadataKey) => {
                body.append(`metadata[${metadataKey}]`, String(params.metadata[metadataKey]));
            });
        }
        return this._makeRequest('', {
            method: 'POST',
            body,
        }).then((envelope) => (0, transformer_js_1.transformEnvelope)(envelope));
    },
    addDocument(id, params) {
        const body = new FormData();
        body.append('document', params.document, params.documentName);
        return this._makeRequest(`/${id}/documents`, {
            method: 'POST',
            body,
        }).then((envelope) => (0, transformer_js_1.transformEnvelope)(envelope));
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
    viewSignedUri(id) {
        return this._makeRequest(`/${id}/session`, { method: 'GET' }).then(({ envelopeView }) => envelopeView);
    },
    start(id) {
        return this._makeRequest(`/${id}/start`, {
            method: 'PUT',
        }).then((envelope) => (0, transformer_js_1.transformEnvelope)(envelope));
    },
});
