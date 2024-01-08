declare module 'yumisign' {
  namespace YumiSign {
    namespace Subscription {
      type Status =
        | 'active'
        | 'past_due'
        | 'unpaid'
        | 'canceled'
        | 'incomplete'
        | 'incomplete_expired'
        | 'trialing';
    }

    interface Subscription {
      /**
       * Unique identifier.
       */
      id: number;

      /**
       * The subscription status.
       */
      status: Subscription.Status;

      /**
       * The subscription item associated to the subscription.
       */
      subscriptionItem: SubscriptionItem;
    }
  }
}
