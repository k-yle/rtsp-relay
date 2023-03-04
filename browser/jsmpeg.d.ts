// can't publish to DefinitelyTyped beacuse the real jsmpeg is not on NPM

export type PlayerOptions = {
  /** WebSocket URL (starting in `ws://` or `wss://`) */
  url: string;
  /** the HTML Canvas elment to use for video rendering */
  canvas: HTMLCanvasElement;

  /** whether to loop the video (static files only). Default true. */
  loop?: boolean;
  /** whether to start playing immediately (static files only). Default false. */
  autoplay?: boolean;
  /** whether to decode audio. Default true. */
  audio?: boolean;
  /** whether to decode video. Default true. */
  video?: boolean;
  /** URL to an image to use as the poster to show before the video plays. */
  poster?: string;
  /** whether to pause playback when the tab is inactive. Default true. Note that browsers usually throttle JS in inactive tabs anyway. */
  pauseWhenHidden?: boolean;
  /** whether to disable WebGL and always use the Canvas2D renderer. Default false. */
  disableGl?: boolean;
  /** whether to disable WebAssembly and always use JavaScript decoders. Default false. */
  disableWebAssembly?: boolean;
  /** whether the WebGL context is created with preserveDrawingBuffer/** necessary for "screenshots" via canvas.toDataURL(). Default false. */
  preserveDrawingBuffer?: boolean;
  /** whether to load data in chunks (static files only). When enabled, playback can begin before the whole source has been completely loaded. Default true. */
  progressive?: boolean;
  /** when using progressive, whether to defer loading chunks when they're not needed for playback yet. Default true. */
  throttled?: boolean;
  /** when using progressive, the chunk size in bytes to load at a time. Default 1024*1024 (1mb). */
  chunkSize?: number;
  /** whether to decode and display the first frame of the video. Useful to set up the Canvas size and use the frame as the "poster" image. This has no effect when using autoplay or streaming sources. Default true. */
  decodeFirstFrame?: boolean;
  /** when streaming, the maximum enqueued audio length in seconds. */
  maxAudioLag?: number;
  /** when streaming, size in bytes for the video decode buffer. Default 512*1024 (512kb). You may have to increase this for very high bitrates. */
  videoBufferSize?: number;
  /** when streaming, size in bytes for the audio decode buffer. Default 128*1024 (128kb). You may have to increase this for very high bitrates. */
  audioBufferSize?: number;
  /** A callback that is called after each decoded and rendered video frame */
  onVideoDecode?(decoder: unknown, time: unknown): void;
  /** A callback that is called after each decoded audio frame */
  onAudioDecode?(decoder: unknown, time: unknown): void;
  /** A callback that is called whenever playback starts */
  onPlay?(player: Player): void;
  /** A callback that is called whenever playback paused (e.g. when .pause() is called or the source has ended) */
  onPause?(player: Player): void;
  /** A callback that is called when playback has reached the end of the source (only called when loop is false). */
  onEnded?(player: Player): void;
  /** @deprecated A callback that is called whenever there's not enough data for playback */
  onStalled?(player: Player): void;
  /** A callback that is called when source has first received data */
  onSourceEstablished?(source: unknown): void;
  /** A callback that is called when the source has received all data */
  onSourceCompleted?(source: unknown): void;

  /**
   * A callback that is called when the stream disconnects, i.e. when no data has been received for `disconnectThreshold` milliseconds.
   *
   * The callback contains the {@link Player} object, so that you can call `player.destroy()` if required.
   */
  onDisconnect?(player: Player): void;
  /** The time (in milliseconds) to wait before treating a stream as disconnected. Default: 3000ms (3 seconds) */
  disconnectThreshold?: number;
};

export class Player {
  constructor(url: string, options: Omit<PlayerOptions, 'url'>);

  /** start playback */
  play(): void;

  /** pause playback */
  pause(): void;

  /** stop playback and seek to the beginning */
  stop(): void;

  /** advance playback by one video frame. This does not decode audio. Returns true on success, false when there's not enough data. */
  nextFrame(): void;

  /** stops playback, disconnects the source and cleans up WebGL and WebAudio state. The player can not be used afterwards. */
  destroy(): void;

  /** get or set the audio volume (0-1) */
  volume: number;

  /** get or set the current playback position in seconds */
  currentTime: number;

  /** read only, whether playback is paused */
  readonly paused: boolean;
}

/** @internal */
declare global {
  interface Window {
    loadPlayer: unknown;
    JSMpeg: {
      Player: typeof Player;
    };
  }
}

export {};
