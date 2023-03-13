declare module 'yumisign' {
  namespace YumiSign {
    interface Document {
      /**
       * Unique identifier.
       */
      id: number;

      /**
       * The document position in the envelope.
       */
      position: number;

      /**
       * The document file.
       */
      file: File;
    }
  }
}
