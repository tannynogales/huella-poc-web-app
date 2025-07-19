import { Component, OnDestroy, OnInit, signal } from '@angular/core';

@Component({
  selector: 'app-fingerprint',
  imports: [],
  templateUrl: './fingerprint.component.html',
  styleUrl: './fingerprint.component.scss',
})
export class FingerprintComponent  {
 private ws: WebSocket | undefined;
  fingerprintBase64: string | null = null;
  error: string | null = null;
  capturing = false;

  constructor() {
    this.ws = new WebSocket('ws://localhost:4001');

    this.ws.onopen = () => {
      console.log('[WS] Conectado');
    };

    this.ws.onmessage = (event) => {
      const message = JSON.parse(event.data);

      if (message.event === 'fingerprint') {
        this.fingerprintBase64 = message.data;
        this.error = null;
        this.capturing = false;
      } else if (message.event === 'error') {
        this.error = message.message;
        this.fingerprintBase64 = null;
        this.capturing = false;
      }
    };

    this.ws.onclose = () => {
      console.log('[WS] Desconectado');
    };
  }

  captureFingerprint() {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      console.log('[WS] Enviando solicitud de captura...');
      this.capturing = true;
      this.ws.send(JSON.stringify({ command: 'capture' }));
    } else {
      this.error = 'WebSocket no está conectado';
    }
  }
}