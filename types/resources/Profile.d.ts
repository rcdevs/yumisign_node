declare module 'yumisign' {
  namespace YumiSign {
    interface Profile {
      /**
       * Unique identifier.
       */
      id: number;

      /**
       * The profile first name.
       */
      firstName: string;

      /**
       * The profile last name.
       */
      lastName: string;

      /**
       * The profile email address.
       */
      email: string;
    }
  }
}
