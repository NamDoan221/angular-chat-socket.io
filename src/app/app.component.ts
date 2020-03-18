import { Component, OnInit } from '@angular/core';
import { ChatService } from './chat.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  user: string;
  room: string;
  messageText: string;
  messageArray: Array<{ user: string, message: string }> = [];
  constructor(private chatService: ChatService) {}

  join() {
    this.chatService.joinRoom({ user: this.user, room: this.room });
  }

  leave() {
    this.chatService.leaveRoom({ user: this.user, room: this.room });
  }

  sendMessage() {
    this.chatService.sendMessage({ user: this.user, room: this.room, message: this.messageText });
    this.messageText = '';
  }

  ngOnInit() {
    this.chatService.newUserJoined()
    .subscribe(data => this.messageArray.push(data));

    this.chatService.userLeftRoom()
    .subscribe(data => this.messageArray.push(data));

    this.chatService.newMessageReceived()
    .subscribe(data => this.messageArray.push(data));
  }
}
