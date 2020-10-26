import * as express from 'express';
import type { Application } from 'express-ws';
import * as rtspRelay from '..';

// If this file compiles, it means that TS definitions are valid

const app = (express() as unknown) as Application;

const { proxy } = rtspRelay(app);

const handler = proxy({
  url: `rtsp://admin:admin@10.0.1.2:554/feed`,
  // if your RTSP stream need credentials, include them in the URL as above
  verbose: false,
});

// the endpoint our RTSP uses
app.ws('/api/stream', handler);

// this is an example html page to view the stream
app.get('/', (_req, res) =>
  res.send(`
  <canvas id='canvas'></canvas>

  <script src='https://cdn.jsdelivr.net/gh/phoboslab/jsmpeg@9cf21d3/jsmpeg.min.js'></script>
  <script>
    new JSMpeg.Player('ws://' + location.host + '/api/stream', {
      canvas: document.getElementById('canvas')
    })
  </script>
`),
);

app.listen(2000);
