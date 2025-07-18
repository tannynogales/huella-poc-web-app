import { Component, OnDestroy, OnInit, signal } from '@angular/core';

@Component({
  selector: 'app-fingerprint',
  imports: [],
  templateUrl: './fingerprint.component.html',
  styleUrl: './fingerprint.component.scss',
})
export class FingerprintComponent implements OnInit, OnDestroy {
  private ws!: WebSocket;
  fingerprint = signal<string | null>(null);
  error = signal<string | null>(null);

  ngOnInit() {
    this.ws = new WebSocket('ws://localhost:4001');
    this.ws.onmessage = (msg) => {
      const { event, data, message } = JSON.parse(msg.data);
      if (event === 'finger-captured') {
        this.fingerprint.set(data);
      } else if (event === 'error') {
        this.error.set(message);
      }
    };
    this.ws.onerror = () => this.error.set('WebSocket connection error');
  }

  ngOnDestroy() {
    this.ws.close();
  }
}
