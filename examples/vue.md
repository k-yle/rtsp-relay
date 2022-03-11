```vue
<template>
  <canvas ref="canvas" />
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { loadPlayer } from 'rtsp-relay/browser';

const canvas = ref(null);

onMounted(() => {
  loadPlayer({
    url: 'ws://localhost:2000/api/stream/2',
    canvas: canvas.value,
  });
});
</script>
```
