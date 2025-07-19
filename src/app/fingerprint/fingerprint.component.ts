import { Component, OnDestroy, OnInit, signal } from '@angular/core';

@Component({
  selector: 'app-fingerprint',
  imports: [],
  templateUrl: './fingerprint.component.html',
  styleUrl: './fingerprint.component.scss',
})
export class FingerprintComponent implements OnInit, OnDestroy {
 fingerprint = signal<string | null>(null);
  error = signal<string | null>(null);
  private ws!: WebSocket;

  ngOnInit() {
    console.log('Conectando al WebSocket...');
    this.ws = new WebSocket('ws://localhost:4001');

    this.ws.onopen = () => console.log('WebSocket abierto');
    this.ws.onmessage = (msg) => {
      console.log('Mensaje recibido:', msg.data);
      const parsed = JSON.parse(msg.data);
      if (parsed.event === 'finger-captured') {
        this.fingerprint.set(parsed.data);
      } else if (parsed.event === 'error') {
        this.error.set(parsed.message);
      }
    };

    this.ws.onerror = (err) => {
      console.error('Error WebSocket:', err);
      this.error.set('Error en la conexión WebSocket');
    };
  }

  ngOnDestroy() {
    console.log('Cerrando WebSocket');
     if (this.ws) this.ws.close();
   }
}
