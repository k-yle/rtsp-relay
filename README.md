# 📽 RTSP Relay

[![Build Status](https://github.com/k-yle/rtsp-relay/workflows/build/badge.svg)](https://github.com/k-yle/rtsp-relay/actions)
[![Coverage Status](https://coveralls.io/repos/github/k-yle/rtsp-relay/badge.svg?branch=main)](https://coveralls.io/github/k-yle/rtsp-relay?branch=main)
[![npm version](https://badge.fury.io/js/rtsp-relay.svg)](https://badge.fury.io/js/rtsp-relay)
![npm bundle size](https://img.shields.io/bundlephobia/minzip/rtsp-relay)

This module allows you to view an RTSP stream in your web browser using an existing express.js server.

Internally, this module uses websockets to create an endpoint in your web server (e.g. `/api/stream`) which relays the RTSP stream using ffmpeg. On the client side, JS-MPEG is used to decode the websocket stream.

The module handles all the complications that unreliable connections introduce:

- if the connection between `server` <=> `RTSP stream` is disconnected, it will automatically be reconnected when available
- if the connection between `client` <=> `server` is disconnected, the client will keep trying to reconnect
- if multiple clients connect, only one instance of the RTSP stream is consumed to improve performance (one-to-many)

## Install

```sh
npm install -S rtsp-relay express
```

You don't need to install ffmpeg!

## Example

```js
const express = require('express');
const app = express();

const { proxy, scriptUrl } = require('rtsp-relay')(app);

const handler = proxy({
  url: `rtsp://admin:admin@10.0.1.2:554/feed`,
  // if your RTSP stream need credentials, include them in the URL as above
  verbose: false,
});

// the endpoint our RTSP uses
app.ws('/api/stream', handler);

// this is an example html page to view the stream
app.get('/', (req, res) =>
  res.send(`
  <canvas id='canvas'></canvas>

  <script src='${scriptUrl}'></script>
  <script>
    loadPlayer({
      url: 'ws://' + location.host + '/api/stream',
      canvas: document.getElementById('canvas')
    });
  </script>
`),
);

app.listen(2000);
```

Open [http://localhost:2000](http://localhost:2000) in your web browser.

## Example using ES6 Imports (e.g. React, Vue)

If you have babel/webpack set up, you can import the `loadPlayer` instead of using a `<script>` tag.

For a react example, see [here](test/react/index.tsx)

```js
// client side code
import { loadPlayer } from 'rtsp-relay/browser';

loadPlayer({
  url: `ws://${location.host}/stream`,
  canvas: document.getElementById('canvas'),
});
```

### Usage with many cameras

If you have hundreds of cameras and don't want to define a seperate route for each one, you can use a dynamic URL:

```js
app.ws('/api/stream/:cameraIP', (ws, req) =>
  proxy({
    url: `rtsp://${req.params.cameraIP}:554/feed`,
  })(ws),
);
```

### Usage with many clients

You may see a `MaxListenersExceededWarning` if the relay is re-transmitting 10+ streams at once, or if 10+ clients are watching.

This is expected, and you can silence the warning by adding `process.setMaxListeners(0);` to your code.

### Improving the video quality

Depending on your network configuration, you can try add the following `additionalOptions` to improve the stream quality:

<!-- prettier-ignore -->
```js
app.ws('/api/stream', proxy({
  additionalOptions: [

    // try this:
    '-rtsp_transport', 'tcp',

    // or this:
    '-q', '1',
  ],
}));
```

Note that both these methods will use more bandwidth.

### SSL

If you want to use HTTPS, you will need to change the stream URL to `wss://`, like the following example:

```js
const rtspRelay = require('rtsp-relay');
const express = require('express');
const https = require('https');
const fs = require('fs');

const key = fs.readFileSync('./server.key', 'utf8');
const cert = fs.readFileSync('./server.crt', 'utf8');

const app = express();
const server = https.createServer({ key, cert }, app);

const { proxy, scriptUrl } = rtspRelay(app, server);

app.ws('/api/stream', proxy({ url: 'rtsp://1.2.3.4:554' }));

app.get('/', (req, res) =>
  res.send(`
  <canvas id='canvas'></canvas>

  <script src='${scriptUrl}'></script>
  <script>
    loadPlayer({
      url: 'wss://' + location.host + '/api/stream',
      canvas: document.getElementById('canvas')
    });
  </script>
`),
);

server.listen(443);
```

## Contributing

We have end-to-end tests to ensure that the module actually works. These tests spin up a RTSP server using [aler9/rtsp-simple-server](https://github.com/aler9/rtsp-simple-server) and create several different streams for testing. These tests are far from complete.

To make developing easier, run `node test/setupTests`. This creates two RTSP streams that can be used instead of real IP cameras (`rtsp://localhost:8554/sync-test-1` and `rtsp://localhost:8554/sync-test-2`).
