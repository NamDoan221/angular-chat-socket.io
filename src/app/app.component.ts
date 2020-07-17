import { Component, OnInit } from "@angular/core";
import { ChatService } from "./chat.service";
import { roomsData } from "./rooms.data";
import { User, Room } from "./chat.model";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"],
})
export class AppComponent implements OnInit {
  roomsList: Array<{ name: string; image: string }>;
  user: User;
  room: Room;
  messageText: string;
  messageArray: Array<{ user: User; message: string; time: Date }>;
  isViewMore: boolean;
  constructor(private chatService: ChatService) {
    this.roomsList = roomsData;
    this.messageArray = [];
    this.user = {
      name: "",
      image: "https://stock.wikimini.org/w/images/9/95/Gnome-stock_person-avatar-profile.png",
    };
    this.room = {
      name: "No room",
      image: "https://stock.wikimini.org/w/images/9/95/Gnome-stock_person-avatar-profile.png",
    };
    this.isViewMore = false;
  }

  join() {
    this.chatService.joinRoom({
      user: this.user,
      room: this.room.name,
      time: new Date(),
    });
    this.messageArray = [];
  }

  leave() {
    this.chatService.leaveRoom({
      user: this.user,
      room: this.room.name,
      time: new Date(),
    });
    this.room = {
      name: "No room",
      image: "https://stock.wikimini.org/w/images/9/95/Gnome-stock_person-avatar-profile.png",
    };
    this.messageArray = [];
  }

  sendMessage() {
    this.chatService.sendMessage({
      user: this.user,
      room: this.room.name,
      time: new Date(),
      message: this.messageText,
    });
    this.messageText = "";
    console.log(this.messageArray);
  }

  removeAccents(str: string) {
    return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  }

  searchRoom(event: any) {
    if (event.target.value === "") {
      return (this.roomsList = roomsData);
    }
    this.roomsList = roomsData.filter(
      (room) =>
        this.removeAccents(room.name)
          .toLowerCase()
          .indexOf(this.removeAccents(event.target.value).toLowerCase()) > -1
    );
  }

  getUser() {
    this.user.name = prompt("Please enter your name");
    if (this.user.name === null) {
      this.user.name = `Friend${Math.floor(Math.random() * 10)}`;
    }
    this.user.image = `https://picsum.photos/id/${Math.floor(
      Math.random() * 1000
    )}/200/300`;
  }

  viewMore() {
    this.isViewMore = !this.isViewMore;
  }

  chooseRoom(room) {
    const confirmResult = confirm(`Are you want to join ${room.name} room?`);
    if (!confirmResult) {
      return;
    }
    this.room = room;
    this.join();
  }

  ngOnInit() {
    this.getUser();

    this.chatService
      .newUserJoined()
      .subscribe((data) => this.messageArray.push(data));

    this.chatService
      .userLeftRoom()
      .subscribe((data) => this.messageArray.push(data));

    this.chatService
      .newMessageReceived()
      .subscribe((data) => this.messageArray.push(data));
  }
}
