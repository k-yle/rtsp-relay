declare module 'ps-node' {
  declare interface Program {
    arguments: string[];
    pid: number;
  }

  export function lookup(
    _: { command: string },
    cb: (err: Error, list: Program[]) => void,
  ): void;

  export function kill(pID: number): void;
}
