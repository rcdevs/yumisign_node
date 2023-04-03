declare module 'yumisign' {
  namespace YumiSign {
    interface EnvelopeRetrieveParams {
      /**
       * Define this params to true if you want retrieve files in envelope with public uri.
       */
      session?: boolean;
    }

    interface EnvelopeListParams {
      /**
       * A list of envelope id you want to retrieve. Min 1, Max 50.
       */
      ids: string[];
    }

    interface EnvelopeCreateParams {
      /**
       * A name for your envelope.
       */
      name: string;

      /**
       * The document attached to the envelope.
       */
      document: Blob;

      /**
       * The name of the document attached to the envelope.
       */
      documentName: string;

      /**
       * A list of steps for your envelope.
       * Steps are launched one after the other.
       * Contains the recipients with her name and email address and a type,
       * 'Sign' for require a signatures and 'Review' for require a reviewing,
       * for recipients of the step.
       */
      steps: {
        recipients: {
          name: string;
          email: string;
        }[];
        type: 'sign' | 'review';
      }[];

      /**
       * Workspace id for store the envelope.
       * First workspace used by default.
       */
      workspaceId?: number;

      /**
       * An expiration date for the envelope.
       * Must be between now and 90 days. Default 7 days.
       */
      expiryDate?: number;
    }

    interface EnvelopeAddDocumentParams {
      /**
       * A new document added to the envelope.
       */
      document: Blob;

      /**
       * The name of the new document added to the envelope.
       */
      documentName: string;
    }

    interface EnvelopeDesignerUriParams {
      /**
       * A callback uri call by the designer.
       */
      callback?: string;

      /**
       * By default, the designer is used to fill fields.
       * Define this param to "true" if you want to force start envelope after.
       */
      autoStart?: boolean;
    }

    class EnvelopesResource extends YumiSignResource {
      /**
       * Retrieves an envelope.
       */
      retrieve(
        id: string,
        params?: EnvelopeRetrieveParams
      ): Promise<YumiSign.Response<YumiSign.Envelope>>;

      /**
       * Return a list of envelopes.
       */
      list(params: EnvelopeListParams): YumiSign.BulkPromise<YumiSign.Envelope>;

      /**
       * Create a new envelope.
       */
      create(
        params: EnvelopeCreateParams
      ): Promise<YumiSign.Response<YumiSign.Envelope>>;

      /**
       * Add a document to the envelope.
       */
      addDocument(
        id: string,
        params: EnvelopeAddDocumentParams
      ): Promise<YumiSign.Response<YumiSign.Envelope>>;

      /**
       * Get designer uri with public session for place fields in documents.
       */
      designerUri(
        id: string,
        params?: EnvelopeDesignerUriParams
      ): Promise<string>;

      /**
       * Send the envelope for request signatures.
       */
      start(id: string): Promise<YumiSign.Response<YumiSign.Envelope>>;
    }
  }
}
