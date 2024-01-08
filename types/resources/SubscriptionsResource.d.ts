declare module 'yumisign' {
  namespace YumiSign {
    class SubscriptionsResource extends YumiSignResource {
      /**
       * Retrieves a subscription.
       */
      retrieve(id: number): Promise<YumiSign.Response<YumiSign.Subscription>>;
    }
  }
}
