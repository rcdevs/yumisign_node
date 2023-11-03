declare module 'yumisign' {
  namespace YumiSign {
    interface TemplateListParams extends YumiSign.PaginationParams {}

    interface TemplateUseParams {
      /**
       * A name for your envelope.
       */
      name: string;

      /**
       * A list of recipients name and email addresses.
       */
      recipients: {
        name: string;
        email: string;
      }[];

      /**
       * Workspace id for store the envelope.
       */
      workspaceId: number;
    }

    class TemplatesResource extends YumiSignResource {
      /**
       * Retrieves an template.
       */
      retrieve(
        workspaceId: number,
        id: number
      ): Promise<YumiSign.Response<YumiSign.Template>>;

      /**
       * Returns a list of your workspaces.
       */
      list(
        workspaceId: number,
        params?: TemplateListParams
      ): YumiSign.PaginatedListPromise<YumiSign.Template>;

      /**
       * Create a new envelope from template.
       */
      use(
        id: number,
        params: TemplateUseParams
      ): Promise<YumiSign.Response<YumiSign.Envelope>>;
    }
  }
}
