declare module 'yumisign' {
  namespace YumiSign {
    namespace Envelope {
      type Type = 'simple' | 'advanced' | 'qualified';

      /**
       * - "not_started": You can edit the envelope, add documents, place fields ...
       * - "started": Signatures are requested (just wait recipients responses)
       * - "approved": All signatures are made (just wait completion)
       * - "declined": At least one signature has been declined
       * - "canceled": You have canceled the envelope
       * - "expired": At least one signature is missing after the expiration date
       * - "signed": Envelope is archived, you can find it in your documents
       * - "blocked": Envelope is blocked, need to process unblocking action(s)
       */
      type Status =
        | 'not_started'
        | 'started'
        | 'approved'
        | 'declined'
        | 'canceled'
        | 'expired'
        | 'signed'
        | 'blocked';
    }

    interface Envelope {
      /**
       * Unique identifier.
       */
      id: string;

      /**
       * Name of the envelope.
       */
      name: string;

      /**
       * Type of the envelope
       */
      type: Envelope.Type;

      /**
       * Status of the envelope.
       */
      status: Envelope.Status;

      /**
       * The creation date as timestamp.
       */
      createDate: number | undefined;

      /**
       * The expiration date as timestamp.
       */
      expiryDate: number;

      /**
       * The workspace identifier where the envelope is stored.
       */
      workspaceId: number | undefined;

      /**
       * The envelope creator.
       */
      creator: Profile | undefined;

      /**
       * List of documents in the envelope.
       */
      documents: Document[];
    }
  }
}
