import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { MatMenuTrigger } from '@angular/material/menu';
import { SocketioService } from 'src/app/services/socketio.service';
import adapter from 'webrtc-adapter';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-conference',
  templateUrl: './conference.component.html',
  styleUrls: ['./conference.component.sass']
})
export class ConferenceComponent implements OnInit {
  @ViewChild('taTrigger') taTrigger: MatMenuTrigger;
  taOn: boolean;
  video: HTMLVideoElement;
  share: HTMLVideoElement;
  constraints = { audio: false, video: true };
  videoOn: boolean;
  shareOn: boolean;
  message: string;
  activeCalls: any[];
  peerConnection;

  constructor(private socket: Socket, private httpClient: HttpClient, private cdr: ChangeDetectorRef) { 
    this.setupSocketConnection();
  } //private socketService: SocketioService

  ngOnInit(): void {
    this.activeCalls = []
    this.shareOn = false;
    this.taOn = false;
    this.message = 'Start';
    // this.socketService.getMessages().subscribe(
    //   (message: string) => {
    //     console.log('Received', message);
    //   },
    //   (err) => {
    //     console.log(err);
    //   }
    // );
  }

  openTA(message: string): void{
    this.taTrigger.openMenu();
    let notification = document.getElementById("ta-notification");
    notification.innerHTML =  message;
    this.taOn = true;
    setTimeout(() => 
    {
        this.taTrigger.closeMenu();
        this.taOn = false;
    },
    5000);
  }

  startVideo(): void {
    this.video = document.getElementById('host-video') as HTMLVideoElement;
    this.videoOn = true;

    navigator.getUserMedia(
      { video: { mandatory: {maxHeight: 240} } as MediaTrackConstraints, audio: false },
      stream => {
        this.video.srcObject = stream;
        console.log('Streaming video');
      },
      (error) => {
        console.log('Error: ' + error);
        this.videoOn = false;
      }
    );
  }
 
  startShare(): void {
    this.share = document.getElementById('shared-screen') as HTMLVideoElement;
    this.shareOn = true;
    // @ts-ignore
    navigator.mediaDevices.getDisplayMedia().then(
      (stream) => {
        this.share.srcObject = stream;
        console.log('Sharing screen');
        (<MediaStream>this.share.srcObject).getVideoTracks()[0].addEventListener('ended', () => {
          this.stopSharing();
        });
      },
      (error) => {
        console.log('Error: ' + error);
        this.shareOn = false;
      }
    );
  }
 
  stopSharing(): void {
    console.log('screensharing has ended')
    this.share.srcObject = undefined;
    this.shareOn = false;
  }
 
  stopVideo(): void {
    console.log('video sharing has ended')
    if(this.videoOn){
      (<MediaStream>this.video.srcObject).getTracks().forEach((track) => {
        track.stop();
      });
      this.videoOn = false;
      this.video.srcObject = undefined;
    }
  }
 
  // emitMessage(): void {
  //   this.socketService.emitMessage(this.message);
  // }
 
  captureVideo(){
    if( this.videoOn){
      console.log("Capturing")
      const canvas = document.createElement("canvas");
      // scale the canvas accordingly
      canvas.width = this.video.videoWidth;
      canvas.height = this.video.videoHeight;
      // draw the video at that frame
      canvas.getContext('2d')
        .drawImage(this.video, 0, 0, canvas.width, canvas.height);
      // convert it to a usable data URL
      //this.socketService.emitImage(canvas.toDataURL());
      this.httpClient.post(environment.FLASK_ENDPOINT, canvas.toDataURL()).subscribe(data => {
        console.log(data)
      })
    }
    else{
      console.error("Video stream is not on!");
    }
 
  }

  /* 
    Start of WebRTC functions
  */

  ngOnDestroy(): void {
    console.log("Should destroy");
    this.socket.disconnect();
    //this.socket.emit("disconnect");
  }

  
  setupSocketConnection() {
    const { RTCPeerConnection, RTCSessionDescription } = window;
    this.peerConnection = new RTCPeerConnection();
    console.log("RTC Peer connection created");

    //this.socket = io("localhost:5000", {transports: ['websocket', 'polling', 'flashsocket']});
    console.log("Socket connection created");

    this.socket.on("update-user-list", ({ users }) => {
      console.log("Update user list request received");
      this.updateUserList(users);
    });

    this.socket.on("remove-user", ({ socketId }) => {
      console.log("Remove user request received");
      const elToRemove = document.getElementById(socketId);

      if (elToRemove) {
        elToRemove.remove();
      }
    });

    this.socket.on("call-made", async data => {
      console.log("Call made request received");
      await this.peerConnection.setRemoteDescription(
        new RTCSessionDescription(data.offer)
      );
      console.log("Remote desc set");
      const answer = await this.peerConnection.createAnswer();
      console.log("Answer created");
      await this.peerConnection.setLocalDescription(new RTCSessionDescription(answer));
      console.log("Local desc set");

      this.socket.emit("make-answer", {
        answer,
        to: data.socket
      });
      console.log("Make answer request sent");
    });

    this.socket.on("answer-made", async data => {
      console.log("Answer made request received");
      await this.peerConnection.setRemoteDescription(
        new RTCSessionDescription(data.answer)
      );
      console.log("Remote desc set");
      this.callUser(data.socket);
      console.log("Remote desc set");
    });

    this.peerConnection.ontrack = function({ streams: [stream] }) {
      
      var vidElement = document.createElement('video');
      vidElement.setAttribute('autoplay', '');
      vidElement.setAttribute('muted', '');
      vidElement.srcObject = stream;

      document.getElementById('remote-videos').appendChild(vidElement);
      // const remoteVideo = document.getElementById("remote-video") as HTMLVideoElement;
      // if (remoteVideo) {
      //   remoteVideo.srcObject = stream;
      // }
    };
    
    this.videoOn = true;
    navigator.getUserMedia(
      { video: { mandatory: {maxHeight: 240} } as MediaTrackConstraints, audio: false },
      stream => {
        this.video = document.getElementById('host-video') as HTMLVideoElement;
        if (this.video) {
          this.video.srcObject = stream;
          console.log('Streaming video');
        }

        stream.getTracks().forEach(track => this.peerConnection.addTrack(track, stream));
      },
      error => {
        console.log('Error: ' + error);
        this.videoOn = false;
      }
    );
  }

  unselectUsersFromList() {
    const alreadySelectedUser = document.querySelectorAll(
      ".active-user.active-user--selected"
    );
  
    alreadySelectedUser.forEach(el => {
      el.setAttribute("class", "active-user");
    });
  }
  
  createUserItemContainer(socketId) {
    const userContainerEl = document.createElement("div");
  
    const usernameEl = document.createElement("p");
  
    userContainerEl.setAttribute("class", "active-user");
    userContainerEl.setAttribute("id", socketId);
    usernameEl.setAttribute("class", "username");
    usernameEl.innerHTML = `Socket: ${socketId}`;
  
    userContainerEl.appendChild(usernameEl);
  
    userContainerEl.addEventListener("click", () => {
      this.unselectUsersFromList();
      userContainerEl.setAttribute("class", "active-user active-user--selected");
      const talkingWithInfo = document.getElementById("talking-with-info");
      talkingWithInfo.innerHTML = `Talking with: "Socket: ${socketId}"`;
      this.callUser(socketId);
    });
  
    return userContainerEl;
  }
  
  async callUser(socketId) {
    const offer = await this.peerConnection.createOffer();
    await this.peerConnection.setLocalDescription(new RTCSessionDescription(offer));
  
    this.socket.emit("call-user", {
      offer,
      to: socketId
    });
  }
  
  updateUserList(socketIds) {
    console.log("Updating", socketIds);
    //const activeUserContainer = document.getElementById("active-user-container");
    console.log("active", this.activeCalls);
    console.log("IDs", socketIds);
    socketIds.forEach(socketId => {
      if(this.activeCalls.includes(socketId) == undefined)
        console.log("Trying to call");
        this.callUser(socketId);
        this.activeCalls.push(socketId);
      // const alreadyExistingUser = document.getElementById(socketId);
      // if (!alreadyExistingUser) {
      //   const userContainerEl = this.createUserItemContainer(socketId);
  
      //   activeUserContainer.appendChild(userContainerEl);
      // }
    });
  }


}
