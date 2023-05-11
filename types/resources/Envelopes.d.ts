declare module 'yumisign' {
  namespace YumiSign {
    namespace Envelope {
      type Type = 'simple' | 'advanced' | 'qualified';

      /**
       * - "not_started": You can edit the envelope, add documents, place fields ...
       * - "stated": Signatures are requested (just wait completion)
       * - "approved": All signatures are made (just wait completion)
       * - "declined": At least on signature has been declined
       * - "canceled": You have canceled the envelope
       * - "expired": At least one signature is missing after the expiration date
       * - "to_be_archived": Envelope is automatically archived after approved
       * - "signed": Envelope is archived
       */
      type Status =
        | 'not_started'
        | 'started'
        | 'approved'
        | 'declined'
        | 'canceled'
        | 'expired'
        | 'to_be_archived'
        | 'signed';
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
       * List of documents in the envelope.
       */
      documents: Document[];

      /**
       * The envelope creator.
       */
      creator: Profile;
    }
  }
}
