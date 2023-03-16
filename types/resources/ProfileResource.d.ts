declare module 'yumisign' {
  namespace YumiSign {
    interface ProfileSignedEnvelopeListParams
      extends YumiSign.PaginationParams {}

    class ProfileResource extends YumiSignResource {
      /**
       * Retrieves current profile.
       */
      retrieve(): Promise<YumiSign.Response<YumiSign.Profile>>;

      /**
       * Return a list of your signed envelopes.
       */
      listSignedEnvelopes(
        params?: ProfileSignedEnvelopeListParams
      ): YumiSign.PaginatedListPromise<YumiSign.Envelope>;
    }
  }
}
