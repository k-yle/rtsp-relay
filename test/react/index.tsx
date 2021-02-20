import React, { useRef, useEffect } from 'react';
import ReactDOM from 'react-dom';

// ❗ change this to `import { loadPlayer } from 'rtsp-relay/browser';`
import { loadPlayer } from '../../browser';

const App: React.VFC = () => {
  const canvas = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!canvas.current) throw new Error('Ref is null');

    loadPlayer({
      url: 'ws://localhost:2000/api/stream/2',
      canvas: canvas.current,
    });
  }, []);

  return <canvas ref={canvas} />;
};

ReactDOM.render(<App />, document.getElementById('root'));
