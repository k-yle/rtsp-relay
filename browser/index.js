// @ts-check
//
// this file is run in the browser! see the README for more infomation
//

/** @typedef {import("./jsmpeg").Player} Player */

(() => {
  /** @returns {Promise<void>} */
  const importJSMpeg = () =>
    new Promise((resolve, reject) => {
      if (window.JSMpeg) {
        resolve(); // already loaded
        return;
      }

      const script = Object.assign(document.createElement('script'), {
        src: 'https://cdn.jsdelivr.net/gh/phoboslab/jsmpeg@b5799bf/jsmpeg.min.js',
        onload: resolve,
        onerror: reject,
      });
      document.head.appendChild(script);
    });

  /**
   * Creates a `Player`. If you intend to create multiple players, you must
   * await for this promise to complete before creating the next player.
   * @param {import("./jsmpeg").PlayerOptions} options
   * @returns {Promise<Player>}
   */
  const loadPlayer = ({
    url,
    onDisconnect,
    disconnectThreshold = 3e3,
    ...options
  }) =>
    importJSMpeg().then(() => {
      return new Promise((resolve, reject) => {
        // hide the canvas until it's loaded and the correct size
        const originalDisplay = options.canvas.style.display;
        // eslint-disable-next-line no-param-reassign
        options.canvas.style.display = 'none';

        let lastRx = Date.now(); // Date.now() is more efficient than performance.now()

        if (options.onVideoDecode && onDisconnect) {
          reject(
            new Error('You cannot specify both onDisconnect and onVideoDecode'),
          );
          return;
        }

        const player = new window.JSMpeg.Player(url, {
          // for performance reasons, only record last packet Rx time if onDisconnect is specified
          onVideoDecode: onDisconnect
            ? () => {
                lastRx = Date.now();
              }
            : undefined,
          ...options,
        });

        const o = new MutationObserver((mutations) => {
          if (mutations.some((m) => m.type === 'attributes')) {
            // eslint-disable-next-line no-param-reassign
            options.canvas.style.display = originalDisplay;
            resolve(player);
            o.disconnect();
          }
        });
        o.observe(options.canvas, { attributes: true });

        if (onDisconnect) {
          const i = setInterval(() => {
            if (Date.now() - lastRx > disconnectThreshold) {
              onDisconnect(player);
              clearInterval(i);
            }
          }, disconnectThreshold / 2);
        }
      });
    });

  if (typeof module !== 'undefined') {
    // being imported
    module.exports = { loadPlayer };
  } else {
    // loaded via script tag
    window.loadPlayer = loadPlayer;
  }
})();
