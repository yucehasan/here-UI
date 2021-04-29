import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
} from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { MatMenuTrigger } from '@angular/material/menu';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { SlideComponent } from 'src/app/components/slide/slide.component';
import { MatDialog } from '@angular/material/dialog';
import { NoteCanvasComponent } from 'src/app/components/note-canvas/note-canvas.component';
import { TaComponent } from 'src/app/components/ta/ta.component';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

const labelStyle =
  'position: absolute; bottom: 5px; width: calc(100% - 20px); \
                    padding-left: 20px; background-color: rgba(0,0,0,0.5);\
                    font-size: 25px; color: white; padding-top: 10px;';

@Component({
  selector: 'app-conference',
  templateUrl: './conference.component.html',
  styleUrls: ['./conference.component.sass'],
})
/* 
TODOS
- PDFTron experiences network failure on some clients (console log says CORS policy (again?!) )
*/
export class ConferenceComponent implements OnInit {
  @ViewChild('taTrigger') taTrigger: MatMenuTrigger;
  @ViewChild('noteTrigger') noteTrigger: MatMenuTrigger;
  @ViewChild(SlideComponent) slideComponent: SlideComponent;

  videoOn: boolean;
  shareOn: boolean;
  noteOn: boolean;
  slideOn: boolean;
  taOn: boolean;
  micOn: boolean;
  participantsOn: boolean;
  chatOn: boolean;

  roomID: number;
  userType: string;
  username: string;

  localVideo: HTMLVideoElement;
  share: HTMLVideoElement;
  socketId;
  localStream;
  connections = [];
  shareStream;
  expectScreen: boolean;

  type: 'instructor' | 'student' = 'instructor';
  currSlideInstr: number;
  syncWithInstr: boolean;

  iceservers: RTCConfiguration = {
    iceServers: [
      { urls: 'stun:stun.l.google.com:19302' },
      { urls: 'stun:stun1.l.google.com:19302' },
      { urls: 'stun:stun2.l.google.com:19302' },
      { urls: 'stun:stun3.l.google.com:19302' },
      { urls: 'stun:stun4.l.google.com:19302' },
    ],
  };

  constructor(
    private socket: Socket,
    private httpClient: HttpClient,
    private dialog: MatDialog,
    private activatedRoute: ActivatedRoute,
    private authService: AuthService,
    private router: Router
  ) {}
  @ViewChild('noteIcon') noteIcon: ElementRef;
  @ViewChild('taIcon') TAIcon: ElementRef;

  ngOnInit(): void {
    this.micOn = false;
    this.shareOn = false;
    this.taOn = false;
    this.noteOn = false;
    this.slideOn = false;
    this.syncWithInstr = true;
    this.participantsOn = false;
    this.chatOn = false;
    this.expectScreen = false;
    this.activatedRoute.params.subscribe((params: Params) => this.roomID = params['roomID']);
    this.authService.getUserType().subscribe((type) => {
      this.userType = type;
    });
    this.authService.getUsername().subscribe((name) => {
      this.username = name;
    });
    this.socket.on("connect", () => {
      this.socketId = this.socket.ioSocket.id;
      this.setListeners();
    })
  }

  leaveSession(): void {
    if (this.userType == 'instructor'){
      this.router.navigate(['analytics'])
    }
    else{
      this.router.navigate(['main']);
    }
  }

  openTA(message: string): void {
    if (!this.taOn) {
      const filterData = {
        top: this.TAIcon.nativeElement.getBoundingClientRect().top,
        left: this.TAIcon.nativeElement.getBoundingClientRect().left,
        message: message
      };
      let dialogRef = this.dialog.open(TaComponent, {
        data: filterData,
        hasBackdrop: false,
        panelClass: 'filter-popup',
      });
      this.taOn = true;

      setTimeout(() => {
        dialogRef.close();
        this.taOn = false;
      }, 2500);
    }
  }

  getScreenshot(): HTMLVideoElement {
    return document.querySelector('.screen-stream');
  }

  openNote(): void {
    if (!this.noteOn) {
      document.getElementById('editIcon').style.color = 'blue';
      const filterData = {
        courseID: this.roomID,
        top: window.innerHeight - this.noteIcon.nativeElement.getBoundingClientRect().top,
        right: this.noteIcon.nativeElement.getBoundingClientRect().right,
        getSnip: this.getScreenshot,
      };
      let dialogRef = this.dialog.open(NoteCanvasComponent, {
        data: filterData,
        hasBackdrop: false,
        panelClass: 'filter-popup',
      });

      this.noteOn = true;
      dialogRef.afterClosed().subscribe(() => {
        this.noteOn = false;
        document.getElementById('editIcon').style.color = 'gray';
      });
    }
  }

  startShare(): void {
    if (this.shareOn) {
      this.stopSharing();
      document.getElementById('screenIcon').style.color = 'gray';
    } else {
      document.getElementById('screenIcon').style.color = 'blue';
      this.share = document.getElementById('shared-screen') as HTMLVideoElement;
      this.shareOn = true;

      this.share = document.createElement('video');
      this.share.setAttribute('style', 'width: 100% ');
      this.share.setAttribute('id', 'my-video');
      this.share.autoplay = true;
      this.share.muted = true;

      var labelDiv = document.createElement('div');
      var label = document.createElement('p');
      label.innerHTML = this.username + '\'s screen';
      labelDiv.appendChild(label);
      labelDiv.setAttribute('style', labelStyle);

      var parentDiv = document.createElement('div');
      parentDiv.setAttribute('style', 'z-index: -1; position: relative');
      parentDiv.appendChild(this.share);
      parentDiv.appendChild(labelDiv);

      document.querySelector('.shared-screen').appendChild(parentDiv);
      this.updateStyles();
      if (navigator.mediaDevices.getUserMedia) {
        this.socket.emit('screen-share', {roomID: this.roomID, username: this.username});
        navigator.mediaDevices
          //@ts-ignore
          .getDisplayMedia()
          .then((stream) => {
            this.getUserScreenSuccess(stream);
          });
      } else {
        alert('Your browser does not support getUserMedia API');
      }
    }
    this.updateStyles();
  }

  stopSharing(): void {
    if (this.shareOn) {
      (<MediaStream>this.shareStream).getTracks().forEach((track) => {
        track.stop();
      });
      this.shareOn = false;
      this.share.srcObject = undefined;
      var parentDiv = document.querySelector('.shared-screen');
      parentDiv.removeChild(parentDiv.firstChild);
      this.socket.emit("close-share", {roomID: this.roomID});
    }
  }

  updateStyles(): void {
    var remoteVids: NodeListOf<HTMLDivElement> = document.querySelector(
      '.remote-videos'
    ).childNodes as NodeListOf<HTMLDivElement>;
    var width;
    if (this.slideOn && this.shareOn) {
      width = '20%';
    } else if (this.slideOn || this.shareOn) {
      width = '50%';
    } else {
      width = '33.3%';
    }
    for (var i = 0; i < remoteVids.length; i++) {
      (remoteVids[i] as HTMLDivElement).style.width = width;
    }
    if(this.shareOn)
      document.getElementById('screenIcon').style.color = 'blue';
    else
      document.getElementById('screenIcon').style.color = 'gray';
  }

  showParticipants(): void {
    if (this.participantsOn) {
      document.getElementById('participantsIcon').style.color = 'gray';
      this.participantsOn = false;
    } else {
      document.getElementById('participantsIcon').style.color = 'blue';
      this.participantsOn = true;
    }
    this.updateStyles();
  }

  openChat(): void {
    if (this.chatOn) {
      document.getElementById('chatIcon').style.color = 'gray';
      this.chatOn = false;
    } else {
      document.getElementById('chatIcon').style.color = 'blue';
      this.chatOn = true;
    }
    this.updateStyles();
  }

  startSlide(): void {
    if (this.slideOn) {
      this.stopSlide();
      document.getElementById('slideIcon').style.color = 'gray';
    } else {
      document.getElementById('slideIcon').style.color = 'blue';
      this.slideOn = true;
    }
    this.updateStyles();
  }

  stopSlide(): void {
    this.slideOn = false;
  }

  onSlideChange(number) {
    if (this.userType == 'instructor') this.socket.emit('slideChange', number);
  }

  nextSlide() {
    if (this.userType == 'student') this.syncWithInstr = false;
    this.slideComponent.nextButton.click();
  }

  prevSlide() {
    if (this.userType == 'student') this.syncWithInstr = false;
    this.slideComponent.prevButton.click();
  }

  syncWithInstructor() {
    this.syncWithInstr = true;
    this.slideComponent.changeSlide(this.currSlideInstr);
  }

  stopVideo(): void {
    if (this.videoOn) {
      (<MediaStream>this.localVideo.srcObject).getTracks().forEach((track) => {
        track.stop();
      });
      this.videoOn = false;
      this.localVideo.srcObject = undefined;
      var video = document.getElementById('my-video');
      var parentDiv = video.parentElement;
      video.parentElement.parentElement.removeChild(parentDiv);
      this.socket.emit("close-video", {roomID: this.roomID});
    }
  }

  captureVideo() {
    if (this.videoOn) {
      const canvas = document.createElement('canvas');
      // scale the canvas accordingly
      canvas.width = this.localVideo.videoWidth;
      canvas.height = this.localVideo.videoHeight;
      // draw the video at that frame
      canvas
        .getContext('2d')
        .drawImage(this.localVideo, 0, 0, canvas.width, canvas.height);
      // convert it to a usable data URL
      const formData = new FormData();
      formData.append('data', canvas.toDataURL());
      this.httpClient
        .post(environment.BACKEND_IP + '/analyze/hand', formData)
        .subscribe(
          (res) => {
            console.log(res);
            var taskID = res["task_id"]
            this.getStatus(taskID); 
          },
          (err) => console.log(err)
        );
    } else {
      console.error('Video stream is not on!');
    }
  }

  getStatus(taskID) {
    this.httpClient
        .get(environment.BACKEND_IP + '/result/' + taskID)
        .subscribe(
          (res) => {
            console.log("res", res);
            const taskStatus = res["task_status"];
            if (taskStatus === 'SUCCESS') {
              if(this.userType === "student"){
                this.socket.emit("analyze-result", {roomID: this.roomID, username: this.username, result: res["task_result"]})
              }
              return false;
            }
            else if ( taskStatus === 'FAILURE') {
              return false;
            }
            setTimeout( () => {
              console.log("retrying");
              this.getStatus(res["task_id"]);
            }, 1000);
          },
          (err) => console.log(err)
        );
  }

  /* 
    Start of WebRTC functions
  */

  startMic() {
    if(this.micOn){
      this.micOn = false;
      document.getElementById('micIcon').setAttribute('class', 'fas fa-microphone-slash');
    }
    else {
      this.micOn = true;
      document.getElementById('micIcon').setAttribute('class', 'fas fa-microphone');
    }
    this.updateStyles();
  }

  startVideo() {
    if (this.videoOn) {
      this.stopVideo();
      document.getElementById('videoIcon').setAttribute('class', 'fas fa-video-slash');
    } else {
      document.getElementById('videoIcon').setAttribute('class', 'fas fa-video');
      this.localVideo = document.createElement('video');
      this.localVideo.setAttribute('style', 'width: 100% ');
      this.localVideo.setAttribute('id', 'my-video');
      this.localVideo.autoplay = true;
      this.localVideo.muted = true;

      var labelDiv = document.createElement('div');
      var label = document.createElement('p');
      label.innerHTML = this.username;
      labelDiv.appendChild(label);
      labelDiv.setAttribute('style', labelStyle);

      var parentDiv = document.createElement('div');
      parentDiv.setAttribute('style', 'z-index: -1; position: relative');
      parentDiv.appendChild(this.localVideo);
      parentDiv.appendChild(labelDiv);

      document.querySelector('.remote-videos').appendChild(parentDiv);
      this.updateStyles();
      var constraints = {
        video: true,
        audio: true,
      };
      if (navigator.mediaDevices.getUserMedia) {
        navigator.mediaDevices
          .getUserMedia(constraints)
          .then((stream) => {
            this.getUserMediaSuccess(stream);
          });
      } else {
        alert('Your browser does not support getUserMedia API');
      }
    }
    this.updateStyles();
  }

  setListeners() {
    console.log("my-id", this.socketId)
    this.socket.on('signal', (fromId, message) =>
      this.gotMessageFromServer(fromId, message)
    );
    
    this.socket.on('anEvent', () => {
      console.log('geldi hocam eventiniz');
    });

    if(this.userType === "instructor"){
      this.socket.on('raise-hand', (data) => {
        console.log(data.username, 'raised hand');
        this.openTA(data.username + ' raised hand');
      });
    }

    this.socket.on('user-left', (id) => {
      var video = document.querySelector('[data-socket="' + id + '"]');
      var parentDiv = video.parentElement;
      video.parentElement.parentElement.removeChild(parentDiv);
    });

    this.socket.on('close-share', (id) => {
      var parentDiv = document.querySelector('.shared-screen');
      parentDiv.removeChild(parentDiv.firstChild);
      this.shareOn = false
      this.updateStyles();
    });

    this.socket.on('user-joined', (id, count, clients) => {
      var socketID;
      var name;
      clients.forEach((client) => {
        if (!this.connections[client.socketID] && client.socketID != this.socketId) {
          socketID = client.socketID;
          name = client.username;
          this.connections[socketID] = new RTCPeerConnection(this.iceservers);
          //Wait for their ice candidate
          this.connections[socketID].onicecandidate = (event) => {
            if (event.candidate != null) {
              this.socket.emit(
                'signal',
                socketID,
                JSON.stringify({ ice: event.candidate })
              );
            }
          };
          //Wait for their video stream
          this.connections[socketID].ontrack = (event) => {
            if (event.track.kind === 'video' && socketID != this.socketId)
              this.gotRemoteStream(event, socketID, name);
          };
          
          //Add the local video stream
          if(this.videoOn)
            this.connections[socketID].addStream(this.localStream);
        }
      });

      //Create an offer to connect with your local description

      if (count >= 2) {
        this.connections[socketID].createOffer().then((description) => {
          this.connections[socketID]
            .setLocalDescription(description)
            .then(() => {
              this.socket.emit(
                'signal',
                socketID,
                JSON.stringify({ sdp: this.connections[socketID].localDescription })
              );
            })
            .catch((e) => console.log(e));
        });
      }
    });

    this.socket.on('slideChange', (number) => {
      this.currSlideInstr = number;
      this.gotSlideUpdate(number);
    });

    this.socket.on('expect-screen', (data) => {
      this.expectScreen = true;
    });

    this.socket.emit('confirm', {
      roomID: this.roomID,
      username: this.username,
      userType: this.userType
    });
    //})
  }

  getUserMediaSuccess(stream) {
    this.videoOn = true;
    this.localStream = stream;
    this.localVideo.srcObject = stream;
    Object.keys( this.connections).forEach( (connectionID) => {
      this.connections[connectionID].addStream(this.localStream);
      this.connections[connectionID].createOffer().then((description) => {
        this.connections[connectionID]
          .setLocalDescription(description)
          .then(() => {
            this.socket.emit(
              'signal',
              connectionID,
              JSON.stringify({ sdp: this.connections[connectionID].localDescription })
            );
          })
          .catch((e) => console.log(e));
      });
    })
  }

  getUserScreenSuccess(stream) {
    this.shareOn = true;
    this.shareStream = stream;
    this.share.srcObject = stream;
    Object.keys( this.connections).forEach( (connectionID) => {
      console.log("sending to", connectionID, this.connections[connectionID])
      this.connections[connectionID].addStream(this.shareStream);
      this.connections[connectionID].createOffer().then((description) => {
        this.connections[connectionID]
          .setLocalDescription(description)
          .then(() => {
            this.socket.emit(
              'signal',
              connectionID,
              JSON.stringify({ sdp: this.connections[connectionID].localDescription })
            );
          })
          .catch((e) => console.log(e));
      });
    })
  }

  gotRemoteStream(event, id, name) {
    if(this.expectScreen){
      var video = document.createElement('video');
      video.setAttribute('class', 'screen-stream');
      video.setAttribute('data-socket', id);
      video.setAttribute('style', 'width: 100%;');
      video.autoplay = true;
      // video.muted = true;
      video.srcObject = event.streams[0];

      var labelDiv = document.createElement('div');
      var label = document.createElement('p');
      label.innerHTML = name + '\'s stream';
      labelDiv.appendChild(label);
      labelDiv.setAttribute('style', labelStyle);

      var parentDiv = document.createElement('div');
      parentDiv.setAttribute('style', 'z-index: -1; position: relative');
      parentDiv.appendChild(video);
      parentDiv.appendChild(labelDiv);
      document.querySelector('.shared-screen').appendChild(parentDiv);
      this.shareOn = true;
      this.expectScreen = false;
    }
    else{
      var video = document.createElement('video');
      video.setAttribute('data-socket', id);
      video.setAttribute('style', 'width: 100%;');
      video.autoplay = true;
      // video.muted = true;
      video.srcObject = event.streams[0];

      var labelDiv = document.createElement('div');
      var label = document.createElement('p');
      label.innerHTML = name;
      labelDiv.appendChild(label);
      labelDiv.setAttribute('style', labelStyle);

      var parentDiv = document.createElement('div');
      parentDiv.setAttribute('style', 'z-index: -1; position: relative');
      parentDiv.appendChild(video);
      parentDiv.appendChild(labelDiv);
      document.querySelector('.remote-videos').appendChild(parentDiv);
    }
    this.updateStyles();
  }

  gotMessageFromServer(fromId, message) {
    //Parse the incoming signal
    var signal = JSON.parse(message);

    //Make sure it's not coming from yourself
    if (fromId != this.socketId) {
      if (signal.sdp) {
        this.connections[fromId]
          .setRemoteDescription(new RTCSessionDescription(signal.sdp))
          .then(() => {
            if (signal.sdp.type == 'offer') {
              this.connections[fromId]
                .createAnswer()
                .then((description) => {
                  this.connections[fromId]
                    .setLocalDescription(description)
                    .then(() => {
                      this.socket.emit(
                        'signal',
                        fromId,
                        JSON.stringify({
                          sdp: this.connections[fromId].localDescription,
                        })
                      );
                    })
                    .catch((e) => console.log(e));
                })
                .catch((e) => console.log(e));
            }
          })
          .catch((e) => console.log(e));
      }

      if (signal.ice) {
        this.connections[fromId]
          .addIceCandidate(new RTCIceCandidate(signal.ice))
          .catch((e) => console.log(e));
      }
    }
  }

  gotSlideUpdate(number) {
    if (this.syncWithInstr) {
      this.slideComponent.changeSlide(number);
    }
  }
}
