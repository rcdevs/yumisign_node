declare module 'yumisign' {
  namespace YumiSign {
    interface AppInitializeParams {
      /**
       * A list of collectible data.
       */
      data: ('profile' | 'workspaces' | 'currentSubscription')[];
    }

    interface AppInitializeResponse {
      /**
       * Your retrievable profile.
       */
      profile?: YumiSign.Profile;

      /**
       * Your retrievable workspaces.
       */
      workspaces?: YumiSign.Workspace[];

      /**
       * Your retrievable current subscription.
       */
      currentSubscription?: YumiSign.Subscription | null;
    }

    class AppResource extends YumiSignResource {
      /**
       * Retrieves requested initialization application data.
       */
      init(
        params: AppInitializeParams
      ): Promise<YumiSign.Response<AppInitializeResponse>>;
    }
  }
}
