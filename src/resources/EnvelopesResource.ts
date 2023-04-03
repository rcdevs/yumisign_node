import YumiSign from 'yumisign';
const YumiSignResource = require('../yumisign.resource');

module.exports = YumiSignResource.extend({
  resourcePath: '/envelopes',

  retrieve(
    id: string,
    params?: YumiSign.EnvelopeRetrieveParams
  ): Promise<YumiSign.Response<YumiSign.Envelope>> {
    return this._makeRequest(`/${id}${params?.session ? '?session=1' : ''}`, {
      method: 'GET',
    });
  },

  list(
    params: YumiSign.EnvelopeListParams
  ): YumiSign.BulkPromise<YumiSign.Envelope> {
    return this._makeRequest('', {
      method: 'GET',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(params),
    });
  },

  create(
    params: YumiSign.EnvelopeCreateParams
  ): Promise<YumiSign.Response<YumiSign.Envelope>> {
    const body = new FormData();
    body.append('name', params.name);
    body.append('document', params.document, params.documentName);
    params.steps.forEach((step, stepIndex) => {
      body.append(`steps[${stepIndex}][type]`, step.type);
      step.recipients.forEach((recipient, recipientIndex) => {
        body.append(
          `steps[${stepIndex}][recipients][${recipientIndex}][name]`,
          recipient.name
        );
        body.append(
          `steps[${stepIndex}][recipients][${recipientIndex}][email]`,
          recipient.email
        );
      });
    });
    if (params.workspaceId)
      body.append('workspaceId', String(params.workspaceId));
    if (params.expiryDate) body.append('expiryDate', String(params.expiryDate));

    return this._makeRequest('', {
      method: 'POST',
      body,
    });
  },

  addDocument(
    id: string,
    params: YumiSign.EnvelopeAddDocumentParams
  ): Promise<YumiSign.Response<YumiSign.Envelope>> {
    const body = new FormData();
    body.append('document', params.document, params.documentName);

    return this._makeRequest(`/${id}/documents`, {
      method: 'POST',
      body,
    });
  },

  designerUri(
    id: string,
    params?: YumiSign.EnvelopeDesignerUriParams
  ): Promise<string> {
    return new Promise((resolve, reject) => {
      this._makeRequest<{session: string; designerUrl: string}>(
        `/${id}/session`,
        {method: 'GET'}
      )
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
    return this._makeRequest(`/${id}/start`, {
      method: 'PUT',
    });
  },
} as YumiSign.EnvelopesResource);
