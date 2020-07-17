import { Injectable } from '@angular/core';
import * as io from 'socket.io-client';
import { Observable } from 'rxjs';
// import { stringify } from 'querystring';
import {User} from "./chat.model";

@Injectable()

export class ChatService {

  private socket = io('https://chats-socket-io.herokuapp.com/');

  joinRoom(data: any) {
    this.socket.emit('join', data);
  }

  newUserJoined() {
    const observable = new Observable<{ user: User, message: string, time: Date }>(observer => {
      this.socket.on('new user joined', (data: { user: User; message: string; time: Date }) => {
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
    const observable = new Observable<{ user: User, message: string, time: Date }>(observer => {
      this.socket.on('left room', (data: { user: User; message: string; time: Date}) => {
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
    const observable = new Observable<{ user: User, message: string, time: Date }>(observer => {
      this.socket.on('new message', (data: { user: User; message: string; time: Date}) => {
        observer.next(data);
      });
      return () => {
        this.socket.disconnect();
      };
    });
    return observable;
  }

}
