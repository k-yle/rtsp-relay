const express = require('express');
const { spawn } = require('child_process');
const { path: ffmpegPath } = require('@ffmpeg-installer/ffmpeg');
const { join } = require('path');
const rtspRelay = require('..');

process.on('warning', (err) => {
  if (err.name === 'MaxListenersExceededWarning') {
    console.log(err.stack);
    console.trace();
  }
});

console.log(`Setting up RTSP server on ${process.platform} (${process.arch})`);

const rtspServer = spawn(
  process.platform === 'win32'
    ? 'rtsp-simple-server' // you need to manually install it on windows
    : join(__dirname, 'rtsp-simple-server'),
);
rtspServer.stdout.pipe(process.stdout);
rtspServer.stderr.pipe(process.stdout);
rtspServer.on('error', console.error);
rtspServer.on('close', process.exit);

const ffmpeg1 = spawn(
  ffmpegPath,
  '-re -stream_loop -1 -i test/video/sync-test-1.ts.mp4 -c copy -f rtsp rtsp://localhost:8554/sync-test-1 -loglevel error'.split(
    ' ',
  ),
);
ffmpeg1.stdout.pipe(process.stdout);
ffmpeg1.stderr.pipe(process.stdout);
ffmpeg1.on('error', console.error);
ffmpeg1.on('close', process.exit);

const ffmpeg2 = spawn(
  ffmpegPath,
  '-re -stream_loop -1 -i test/video/sync-test-2.ts.mp4 -c copy -f rtsp rtsp://localhost:8554/sync-test-2 -loglevel error'.split(
    ' ',
  ),
);
ffmpeg2.stdout.pipe(process.stdout);
ffmpeg2.stderr.pipe(process.stdout);
ffmpeg2.on('error', console.error);
ffmpeg2.on('close', process.exit);

const app = /** @type {import('express-ws').Application} */ (
  /** @type {unknown} */ (express())
);

// setup streams here

const { proxy } = rtspRelay(app);

app.use((_req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', '*');
  next();
});

app.ws('/api/stream/:n', (ws, req) =>
  proxy({
    url: `rtsp://localhost:8554/sync-test-${req.params.n}`,
    verbose: true,
    additionalFlags: ['-loglevel', 'error'],
  })(ws),
);

app.use(express.static('browser'));
app.use(express.static('test/static'));

app.get('/dual-stream', (_req, res) =>
  res.send(`
  <canvas></canvas>
  <canvas></canvas>

  <script src='../index.js'></script>
  <script>
    const [c1, c2] = document.querySelectorAll('canvas');

    async function main() {
      await loadPlayer({ url: 'ws://' + location.host + '/api/stream/2', canvas: c2 });
      await loadPlayer({ url: 'ws://' + location.host + '/api/stream/1', canvas: c1 });
    }
    main();
  </script>
`),
);

// legacy method (need to test that it still works)
app.get('/:n', (req, res) => {
  if (Number.isNaN(+req.params.n)) {
    res.status(404).send();
    return;
  }
  res.send(`
  <canvas></canvas>
  <pre></pre>

  <script src='https://cdn.jsdelivr.net/gh/phoboslab/jsmpeg@b5799bf/jsmpeg.min.js'></script>
  <script>
    const getTime = () => new Date().toISOString().split("T")[1].split(".")[0];
    const log = e => document.querySelector('pre').innerHTML += getTime() + ": " + e + "\\n";

    const listeners = [
      "onPlay",
      "onPause",
      "onStalled",
      "onSourceEstablished",
      "onSourceCompleted"
    ].reduce((ac, e) => ({ ...ac, [e]: () => log(e) }), {});

    new JSMpeg.Player('ws://' + location.host + '/api/stream/${req.params.n}', {
      canvas: document.querySelector('canvas'),
      ${req.query.noLogs ? '' : '...listeners'}
    });
    log("camera ${req.params.n}");
  </script>
`);
});

const server = app.listen(2000, () => console.log('ready'));

Reflect.set(global, 'teardown', () => {
  server.close(async () => {
    ffmpeg1.kill();
    ffmpeg2.kill();

    await new Promise((cb) => setTimeout(cb, 1000));

    rtspServer.kill();
  });
});
