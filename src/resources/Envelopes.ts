import YumiSign from 'yumisign';
import {YumiSignResource} from '../YumiSignResource.js';
import {addQueryParams} from '../utils/uri.js';
import {makeAutoPaginatePromise} from '../utils/pagination.js';
import {toEnvelope} from '../utils/converter.js';

export const Envelopes = YumiSignResource.extend({
  resourcePath: '/envelopes',

  retrieve(
    id: string,
    params?: YumiSign.EnvelopeRetrieveParams,
    options?: YumiSign.RequestOptions
  ): Promise<YumiSign.Response<YumiSign.Envelope>> {
    return this._makeRequest<YumiSign.Envelope>(
      `/${id}${params?.session ? '?session=1' : ''}`,
      {method: 'GET'},
      options
    ).then((envelope) => toEnvelope(envelope));
  },

  list(
    params?: YumiSign.EnvelopeListParams,
    options?: YumiSign.RequestOptions
  ): YumiSign.PaginatedListPromise<YumiSign.Envelope> {
    const list = (
      params?: YumiSign.EnvelopeListParams
    ): Promise<YumiSign.Response<
      YumiSign.PaginatedList<YumiSign.Envelope>
    >> => {
      const endpoint = addQueryParams('', params);

      return this._makeRequest<YumiSign.PaginatedList<YumiSign.Envelope>>(
        endpoint,
        {method: 'GET'},
        options
      ).then((paginatedList) => {
        const {items, ...rest} = paginatedList;

        return {
          items: items.map((item) => toEnvelope(item)),
          ...rest,
        };
      });
    };

    return makeAutoPaginatePromise<YumiSign.Envelope>(
      list(params),
      this,
      list,
      params
    );
  },

  create(
    params: YumiSign.EnvelopeCreateParams,
    options?: YumiSign.RequestOptions
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
    if (params.type) body.append('type', params.type);
    if (params.workspaceId)
      body.append('workspaceId', String(params.workspaceId));
    if (params.expiryDate) body.append('expiryDate', String(params.expiryDate));
    if (params.preferences) {
      params.preferences.forEach((preference, preferenceIndex) => {
        body.append(`preferences[${preferenceIndex}][name]`, preference.name);
        body.append(
          `preferences[${preferenceIndex}][value]`,
          String(preference.value)
        );
      });
    }
    if (params.metadata) {
      Object.keys(params.metadata).forEach((metadataKey) => {
        body.append(
          `metadata[${metadataKey}]`,
          // @ts-ignore
          String(params.metadata[metadataKey])
        );
      });
    }

    return this._makeRequest<YumiSign.Envelope>(
      '',
      {method: 'POST', body},
      options
    ).then((envelope) => toEnvelope(envelope));
  },

  addDocument(
    id: string,
    params: YumiSign.EnvelopeAddDocumentParams,
    options?: YumiSign.RequestOptions
  ): Promise<YumiSign.Response<YumiSign.Envelope>> {
    const body = new FormData();
    body.append('document', params.document, params.documentName);

    return this._makeRequest<YumiSign.Envelope>(
      `/${id}/documents`,
      {method: 'POST', body},
      options
    ).then((envelope) => toEnvelope(envelope));
  },

  designerUri(
    id: string,
    params?: YumiSign.EnvelopeDesignerUriParams,
    options?: YumiSign.RequestOptions
  ): Promise<string> {
    return this._makeRequest<{session: string; designerUrl: string}>(
      `/${id}/session`,
      {method: 'GET'},
      options
    ).then(({designerUrl}) => {
      const url = new URL(designerUrl);
      if (params?.callback) {
        url.searchParams.append('callback', encodeURI(params.callback));
      }
      if (params?.autoStart) {
        url.searchParams.append('auto_start', '1');
      }
      return url.toString();
    });
  },

  viewSignedUri(
    id: string,
    options?: YumiSign.RequestOptions
  ): Promise<string> {
    return this._makeRequest<{session: string; envelopeView: string}>(
      `/${id}/session`,
      {method: 'GET'},
      options
    ).then(({envelopeView}) => envelopeView);
  },

  start(
    id: string,
    options?: YumiSign.RequestOptions
  ): Promise<YumiSign.Response<YumiSign.Envelope>> {
    return this._makeRequest<YumiSign.Envelope>(
      `/${id}/start`,
      {method: 'PUT'},
      options
    ).then((envelope) => toEnvelope(envelope));
  },

  cancel(
    id: string,
    options?: YumiSign.RequestOptions
  ): Promise<YumiSign.Response<YumiSign.Envelope>> {
    return this._makeRequest<YumiSign.Envelope>(
      `/${id}/cancel`,
      {method: 'PUT'},
      options
    ).then((envelope) => toEnvelope(envelope));
  },

  remove(
    id: string,
    options?: YumiSign.RequestOptions
  ): Promise<YumiSign.Response<Record<string, never>>> {
    return this._makeRequest<Record<string, never>>(
      `/${id}`,
      {method: 'DELETE'},
      options
    );
  },
} as YumiSign.EnvelopesResource);
