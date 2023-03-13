declare module 'yumisign' {
  namespace YumiSign {
    class WorkspacesResource extends YumiSignResource {
      /**
       * Returns a list of your workspaces.
       */
      list(): Promise<YumiSign.Response<YumiSign.Workspace[]>>;
    }
  }
}
