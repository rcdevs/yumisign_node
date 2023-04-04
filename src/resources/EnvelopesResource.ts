// import {AxiosHeaders} from 'axios';
import YumiSign from 'yumisign';
const YumiSignResource = require('../yumisign.resource');

module.exports = YumiSignResource.extend({
  resourcePath: '/envelopes',

  retrieve(
    id: string,
    params?: YumiSign.EnvelopeRetrieveParams
  ): Promise<YumiSign.Response<YumiSign.Envelope>> {
    return this._makeRequest({
      method: 'GET',
      url: `/${id}${params?.session ? '?session=1' : ''}`,
    });
  },

  list(ids: string[]): YumiSign.BulkPromise<YumiSign.Envelope> {
    return this._makeRequest({
      method: 'GET',
      data: {ids},
      // params: {ids},
      // headers: AxiosHeaders.from({'content-type': 'application/json'}),
      // data: JSON.stringify({ids}),
    });
  },

  create(
    params: YumiSign.EnvelopeCreateParams
  ): Promise<YumiSign.Response<YumiSign.Envelope>> {
    const data = new FormData();
    data.append('name', params.name);
    data.append('document', params.document, params.documentName);
    params.steps.forEach((step, stepIndex) => {
      data.append(`steps[${stepIndex}][type]`, step.type);
      step.recipients.forEach((recipient, recipientIndex) => {
        data.append(
          `steps[${stepIndex}][recipients][${recipientIndex}][name]`,
          recipient.name
        );
        data.append(
          `steps[${stepIndex}][recipients][${recipientIndex}][email]`,
          recipient.email
        );
      });
    });
    if (params.workspaceId)
      data.append('workspaceId', String(params.workspaceId));
    if (params.expiryDate) data.append('expiryDate', String(params.expiryDate));

    return this._makeRequest({
      method: 'POST',
      data,
    });
  },

  addDocument(
    id: string,
    params: YumiSign.EnvelopeAddDocumentParams
  ): Promise<YumiSign.Response<YumiSign.Envelope>> {
    const data = new FormData();
    data.append('document', params.document, params.documentName);

    return this._makeRequest({
      method: 'POST',
      url: `/${id}/documents`,
      data,
    });
  },

  designerUri(
    id: string,
    params?: YumiSign.EnvelopeDesignerUriParams
  ): Promise<string> {
    return new Promise((resolve, reject) => {
      this._makeRequest<{session: string; designerUrl: string}>({
        method: 'GET',
        url: `/${id}/session`,
      })
        .then(({designerUrl}) => {
          const url = new URL(designerUrl);
          if (params?.callback) {
            url.searchParams.append('callback', encodeURI(params.callback));
          }
          if (params?.autoStart) {
            url.searchParams.append('auto_start', '1');
          }
          resolve(url.toString());
        })
        .catch((error) => reject(error));
    });
  },

  start(id: string): Promise<YumiSign.Response<YumiSign.Envelope>> {
    return this._makeRequest({
      method: 'PUT',
      url: `/${id}/start`,
    });
  },
} as YumiSign.EnvelopesResource);
