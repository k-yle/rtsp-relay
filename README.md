# 📽 RTSP Relay

[![Build Status](https://github.com/k-yle/rtsp-relay/workflows/build/badge.svg)](https://github.com/k-yle/rtsp-relay/actions)
[![npm version](https://badge.fury.io/js/rtsp-relay.svg)](https://badge.fury.io/js/rtsp-relay)

This module allows you to view an RTSP stream in your web browser using an existing express.js server.

Internally, this module uses websockets to create an endpoint in your web server (e.g. `/api/stream`) which relays the RTSP stream using ffmpeg. On the client side, JS-MPEG is used to decode the websocket stream.

The module handles all the complications that unreliable connections introduce:

- if the connection between `server` <=> `RTSP stream` is disconnected, it will automatically be reconnected when available
- if the connection between `client` <=> `server` is disconnected, the client will keep trying to reconnect
- if multiple clients connect, only one instance of the RTSP stream is consumed to improve performance (one-to-many)

## Install

<details>
  <summary>⚠ You need to install <a href="https://www.ffmpeg.org/download.html">ffmpeg</a> on your computer first</summary>

- Windows: `choco install -y ffmpeg` (if you have chocolately)
- macOS: `brew install ffmpeg`
- Linux: `sudo apt-get install -y ffmpeg`
  </details>

```sh
npm install -S rtsp-relay express
```

## Example

```js
const express = require('express');
const app = express();

const { proxy } = require('rtsp-relay')(app);

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

  <script src='https://cdn.jsdelivr.net/gh/phoboslab/jsmpeg@9cf21d3/jsmpeg.min.js'></script>
  <script>
    new JSMpeg.Player('ws://' + location.host + '/api/stream', {
      canvas: document.getElementById('canvas')
    })
  </script>
`),
);

app.listen(2000);
```

Open [http://localhost:2000](http://localhost:2000) in your web browser.
