declare module 'yumisign' {
  namespace YumiSign {
    namespace Event {
      type Type = 'envelope.updated';

      namespace Data {
        type Type = 'envelope';
      }
    }

    interface Event {
      /**
       * Description of the event (e.g., `envelope.update`).
       */
      type: Event.Type;

      /**
       * The API data relevant to the event. For example, an `envelope.update` event will have a type `envelope` and full `Envelope` object of the object key.
       */
      data: {
        type: Event.Data.Type;
        object: {};
      };
    }
  }
}
