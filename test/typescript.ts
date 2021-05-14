import express from 'express';
import https from 'https';
import { readFileSync } from 'fs';
import rtspRelay from 'rtsp-relay';
import { loadPlayer } from 'rtsp-relay/browser';
import type { Application } from 'express-ws';

// If this file compiles, it means that TS definitions are valid

const app = express() as unknown as Application;

const { proxy, scriptUrl } = rtspRelay(app);

const handler = proxy({
  url: `rtsp://admin:admin@10.0.1.2:554/feed`,
  // if your RTSP stream need credentials, include them in the URL as above
  verbose: false,
});

// the endpoint our RTSP uses
app.ws('/api/stream', handler);

// dynamic URL test
app.ws('/api/stream-many/:cameraIP', (ws, req) =>
  proxy({
    url: `rtsp://${req.params.cameraIP}:554/feed`,
  })(ws),
);

// this is an example html page to view the stream
app.get('/', (_req, res) =>
  res.send(`
  <canvas id='canvas'></canvas>

  <script src='${scriptUrl}'></script>
  <script>
    loadPlayer({
      url: 'ws://' + location.host + '/stream',
      canvas: document.getElementById('canvas')
    });
  </script>
`),
);

app.listen(2000);

// SSL test

const key = readFileSync('./server.key', 'utf8');
const cert = readFileSync('./server.crt', 'utf8');

const httpsServer = https.createServer({ key, cert }, app);

httpsServer.listen(8443);

const { proxy: proxy2 } = rtspRelay(app, httpsServer);

app.ws('/ssl-test', proxy2({ url: 'rtsp://1.2.3.4:554' }));

/** Testing browser code */

async function test() {
  const canvas = document.querySelector('canvas');

  if (canvas) {
    const player = await loadPlayer({
      url: `ws://${window.location.host}/stream`,
      canvas,
      audio: false,
      onDisconnect() {
        console.log('Connection lost!');
      },
      disconnectThreshold: 3_000,
    });
    player.destroy();
  }
}

test();
