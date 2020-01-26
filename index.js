const { spawn } = require('child_process');
const ews = require('express-ws');

class InboundStreamWrapper {
  start({ url, additionalFlags = [] }) {
    this.stream = spawn(
      'ffmpeg',
      [
        '-i',
        url,
        '-f',
        'mpegts',
        '-codec:v',
        'mpeg1video',
        '-r',
        '30', // 30 fps. any lower and the client can't decode it
        ...additionalFlags,
        '-',
      ],
      { detached: false },
    );
    this.stream.on('exit', (code, signal) => {
      if (signal !== 'SIGTERM') {
        if (this.verbose) {
          console.warn(
            'Stream died - will recreate when the next client connects',
          );
        }
        this.stream = null;
      }
    });
  }

  get(options) {
    this.verbose = options.verbose;
    if (!this.stream) this.start(options);
    return this.stream;
  }

  kill(clientsLeft) {
    if (this.verbose) console.log('kill', { clientsLeft });
    if (!this.stream) return; // the stream is currently dead
    if (!clientsLeft) {
      this.stream.kill('SIGTERM');
      this.stream = null;
      // next time it is requested it will be recreated
    }
  }
}

module.exports = (app, { url, additionalFlags, verbose }) => {
  const wsInstance = ews(app);
  const wsServer = wsInstance.getWss();
  const Inbound = new InboundStreamWrapper();

  return function VideoStream(ws) {
    if (!url) throw new Error('URL to rtsp stream is required');

    // these should be detected from the source stream
    const [width, height] = [0, 0];

    const streamHeader = Buffer.alloc(8);
    streamHeader.write('jsmp');
    streamHeader.writeUInt16BE(width, 4);
    streamHeader.writeUInt16BE(height, 6);
    ws.send(streamHeader, { binary: true });

    if (verbose) console.log('New WebSocket Connection');
    const streamIn = Inbound.get({ url, additionalFlags, verbose });
    ws.on('close', () => {
      if (verbose) console.log('Disconnected WebSocket');
      Inbound.kill(wsServer.clients.size);
    });

    streamIn.stdout.on('data', (data, opts) => {
      if (ws.readyState === 1) ws.send(data, opts);
    });
  };
};
