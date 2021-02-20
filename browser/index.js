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
        src:
          'https://cdn.jsdelivr.net/gh/phoboslab/jsmpeg@b5799bf/jsmpeg.min.js',
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
  const loadPlayer = ({ url, ...options }) =>
    importJSMpeg().then(() => {
      return new Promise((resolve) => {
        // hide the canvas until it's loaded and the correct size
        const originalDisplay = options.canvas.style.display;
        // eslint-disable-next-line no-param-reassign
        options.canvas.style.display = 'none';

        const player = new window.JSMpeg.Player(url, options);

        const o = new MutationObserver((mutations) => {
          if (mutations.some((m) => m.type === 'attributes')) {
            // eslint-disable-next-line no-param-reassign
            options.canvas.style.display = originalDisplay;
            resolve(player);
            o.disconnect();
          }
        });
        o.observe(options.canvas, { attributes: true });
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
