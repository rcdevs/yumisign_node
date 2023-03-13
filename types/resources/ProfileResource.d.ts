declare module 'yumisign' {
  namespace YumiSign {
    class ProfileResource extends YumiSignResource {
      /**
       * Retrieves current profile.
       */
      retrieve(): Promise<YumiSign.Response<YumiSign.Profile>>;
    }
  }
}
