declare module 'yumisign' {
  namespace YumiSign {
    class WorkspacesResource extends YumiSignResource {
      /**
       * Returns a list of your workspaces.
       */
      list(
        options?: YumiSign.RequestOptions
      ): Promise<YumiSign.Response<YumiSign.Workspace[]>>;
    }
  }
}
