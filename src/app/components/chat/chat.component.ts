import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.sass']
})
export class ChatComponent implements OnInit {
  filterData;
  value;

  constructor(
    private dialogRef: MatDialogRef<ChatComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialog: MatDialog,
  ) { }

  ngOnInit(): void {
    this.setPosition();
  }

  setPosition(): void {
    this.filterData = this.data;
    const leftMosPos = Number(this.filterData.right);
    this.dialogRef.updatePosition({
      bottom: `${this.filterData.top}px`,
      left: `${leftMosPos}px`,
    });
  }

  send(){
    if(this.value != ""){
      console.log(this.data);
      this.data.socket.emit('chat-msg', {roomID: this.data.roomID, message: this.value, sender: this.data.username});
      this.value = "";
    }
  }

}
