declare module '@ffmpeg-installer/ffmpeg' {
  export const path: string;
}

declare namespace NodeJS {
  interface Global {
    /** technically it returns `never` */
    teardown(): void;
  }
}
