```svelte
<canvas bind:this={canvas} />

<script>
import { onMount } from 'svelte';
import { loadPlayer } from 'rtsp-relay/browser';

let canvas;

onMount(() => {
  loadPlayer({
    url: 'ws://localhost:2000/api/stream/2',
    canvas: canvas,
  });
});
</script>
```
