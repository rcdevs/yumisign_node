declare module 'yumisign' {
  namespace YumiSign {
    class WorkspacesResource extends YumiSignResource {
      /**
       * Retrieves a workspace.
       */
      retrieve(
        id: number,
        options?: YumiSign.RequestOptions
      ): Promise<YumiSign.Response<YumiSign.Workspace>>;

      /**
       * Returns a list of your workspaces.
       */
      list(
        options?: YumiSign.RequestOptions
      ): Promise<YumiSign.Response<YumiSign.Workspace[]>>;
    }
  }
}
