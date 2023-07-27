declare module 'yumisign' {
  namespace YumiSign {
    interface Webhooks {
      /**
       * Constructs and verifies the signature of an Event from the provided details.
       */
      constructEvent(
        payload: string | Uint8Array,
        header: string | Uint8Array,
        secret: string,
        tolerance?: number,
        receivedAt?: number
      ): Event;
      /**
       * Verify if a webhook has been sent by YumiSign.
       */
      verifySignature(
        encodedPayload: string | Uint8Array,
        encodedHeader: string | Uint8Array,
        secret: string,
        tolerance: number,
        receivedAt?: number
      ): boolean;
    }
  }
}
