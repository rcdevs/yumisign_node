declare module 'yumisign' {
  namespace YumiSign {
    interface ProfileActionListParams extends YumiSign.PaginationParams {}

    interface ProfileSignedEnvelopeListParams
      extends YumiSign.PaginationParams {}

    class ProfileResource extends YumiSignResource {
      /**
       * Retrieves current profile.
       */
      retrieve(): Promise<YumiSign.Response<YumiSign.Profile>>;

      /**
       * Return a list of your current actions.
       */
      listActions(
        params?: ProfileActionListParams
      ): YumiSign.PaginatedListPromise<YumiSign.Action>;

      /**
       * Return a list of your signed envelopes.
       */
      listSignedEnvelopes(
        params?: ProfileSignedEnvelopeListParams
      ): YumiSign.PaginatedListPromise<YumiSign.Envelope>;
    }
  }
}
