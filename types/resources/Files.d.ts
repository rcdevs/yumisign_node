declare module 'yumisign' {
  namespace YumiSign {
    interface File {
      /**
       * Filename
       */
      name: string;

      /**
       * Format
       */
      format: string;

      /**
       * The stored file uri.
       */
      uri: string;
    }
  }
}
