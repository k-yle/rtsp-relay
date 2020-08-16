declare module 'ps-node' {
  interface Program {
    arguments: string[];
    pid: number;
  }

  export function lookup(
    _: { command: string },
    cb: (err: Error, list: Program[]) => void,
  ): void;

  export function kill(pID: number): void;
}

declare module '@ffmpeg-installer/ffmpeg' {
  export const path: string;
}
