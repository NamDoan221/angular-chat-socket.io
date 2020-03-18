import { Injectable } from '@angular/core';
import * as io from 'socket.io-client';
import { Observable } from 'rxjs';
import { stringify } from 'querystring';

@Injectable()

export class ChatService {

  private socket = io('http://localhost:2201');

  joinRoom(data: any) {
    this.socket.emit('join', data);
  }

  newUserJoined() {
    const observable = new Observable<{ user: string, message: string }>(observer => {
      this.socket.on('new user joined', (data: { user: string; message: string; }) => {
        observer.next(data);
      });
      return () => {
        this.socket.disconnect();
      };
    });
    return observable;
  }

  leaveRoom(data: any) {
    this.socket.emit('leave', data);
  }

  userLeftRoom() {
    const observable = new Observable<{ user: string, message: string }>(observer => {
      this.socket.on('left room', (data: { user: string; message: string; }) => {
        observer.next(data);
      });
      return () => {
        this.socket.disconnect();
      };
    });
    return observable;
  }

  sendMessage(data: any) {
    this.socket.emit('message', data);
  }
  newMessageReceived() {
    const observable = new Observable<{ user: string, message: string }>(observer => {
      this.socket.on('new message', (data: { user: string; message: string; }) => {
        observer.next(data);
      });
      return () => {
        this.socket.disconnect();
      };
    });
    return observable;
  }

}
