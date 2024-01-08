declare module 'yumisign' {
  namespace YumiSign {
    type Feature =
      | 'web'
      | 'api'
      | 'timeline'
      | 'stamp'
      | 'domain_name'
      | 'custom_role'
      | 'brand'
      | 'form_field';

    interface SubscriptionItem {
      /**
       * Unique identifier.
       */
      id: number;

      /**
       * All options available for the item
       */
      options: {
        memberCount: number;
        simpleSignatureCount: number;
        advancedSignatureCount: number;
        qualifiedSignatureCount: number;
        workspaceCount: number;
        templateCount: number;
        cloudStorageIntegrations: string[];
        workspaceIntegrations: string[];
        requirements: string[];
        features: Feature[];
      };
    }
  }
}
