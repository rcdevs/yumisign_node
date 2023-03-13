declare module 'yumisign' {
  namespace YumiSign {
    interface File {
      /**
       * Filename
       */
      name: string;

      /**
       * The stored file uri.
       */
      uri: string;
    }
  }
}
