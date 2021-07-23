declare namespace NodeJS {
  interface Global {
    /** technically it returns `never` */
    teardown(): void;
  }
}
