import { Injectable } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SocketioService {
  RTCSocket: Socket;
  socket: Socket;
  constructor() {
    this.socket = io(environment.FLASK_ENDPOINT);
  }

  emitMessage(message: string): void{
    this.socket.emit('message', message);
  }

  emitImage(image: string): void{
    this.socket.emit('image', image);
  }


  getMessages() {
    return new Observable((observer) => {
        this.socket.on('message', (message) => {
          observer.next(message);
        });
    });
  }
}