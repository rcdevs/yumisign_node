declare module 'yumisign' {
  namespace YumiSign {
    namespace Action {
      type Type = Step.Type;

      type Status = Envelope.Status;
    }

    interface Action {
      /**
       * Unique identifier.
       */
      id: number;

      /**
       * The action type.
       */
      type: Action.Type;

      /**
       * The action status.
       */
      status: Action.Status;

      /**
       * The envelope associated to the action.
       */
      envelope: Envelope;

      /**
       * The uri for sign or review the envelope publicly.
       */
      publicSignUri: string | undefined;
    }
  }
}
