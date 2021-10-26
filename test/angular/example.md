### app.component.html

```html
<canvas #videoPlayer></canvas>
```

### app.component.js

```ts
import { Component, ElementRef, AfterViewInit, ViewChild } from '@angular/core';
import { loadPlayer, Player } from 'rtsp-relay/browser';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
})
export class AppComponent implements AfterViewInit {
  /** the instance of the rtsp-relay client */
  player?: Player;

  @ViewChild('videoPlayer')
  videoPlayer?: ElementRef<HTMLCanvasElement>;

  async ngAfterViewInit() {
    // this will wait until the connection is established
    this.player = await loadPlayer({
      url: 'ws://localhost:2000/api/stream/1',
      canvas: this.videoPlayer!.nativeElement,

      // optional
      onDisconnect: () => console.log('Connection lost!'),
    });

    console.log('Connected!', this.player);
  }
}
```
