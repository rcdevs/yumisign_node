declare module 'yumisign' {
  namespace YumiSign {
    interface Template {
      /**
       * Unique identifier.
       */
      id: number;

      /**
       * Name of the template.
       */
      name: string;

      /**
       * Type of the template
       */
      type: Envelope.Type;

      /**
       * Number of recipients configured on this template
       */
      recipientsCount: number;

      /**
       * A list of recipients for your template
       */
      recipients?: {
        id: number;
        name: string;
      }[];

      /**
       * The creation date as timestamp.
       */
      createDate: number | undefined;
    }
  }
}
