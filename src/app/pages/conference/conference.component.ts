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
import { ActivatedRoute } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-conference',
  templateUrl: './conference.component.html',
  styleUrls: ['./conference.component.sass'],
})
export class ConferenceComponent implements OnInit {
  @ViewChild('taTrigger') taTrigger: MatMenuTrigger;
  @ViewChild('noteTrigger') noteTrigger: MatMenuTrigger;
  @ViewChild(SlideComponent) slideComponent: SlideComponent;

  videoOn: boolean;
  shareOn: boolean;
  noteOn: boolean;
  slideOn: boolean;
  taOn: boolean;

  roomID: number;
  userType: string;

  localVideo: HTMLVideoElement;
  share: HTMLVideoElement;
  socketId;
  localStream;
  connections = [];

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
    private authService: AuthService
  ) {}
  @ViewChild('noteIcon') noteIcon: ElementRef;
  @ViewChild('taIcon') TAIcon: ElementRef;

  ngOnInit(): void {
    this.shareOn = false;
    this.taOn = false;
    this.noteOn = false;
    this.slideOn = false;
    this.syncWithInstr = true;
    this.activatedRoute.queryParams.subscribe((params) => {
      this.roomID = params['roomID'];
      console.log(this.roomID); // Print the parameter to the console.
    });
    this.authService.getUserType().subscribe( (type) => {
      this.userType = type;
    });
  }

  openTA(message: string): void {
    const filterData = {
      top: this.TAIcon.nativeElement.getBoundingClientRect().top,
      left: this.TAIcon.nativeElement.getBoundingClientRect().left,
    };
    let dialogRef = this.dialog.open(TaComponent, {
      data: filterData,
      hasBackdrop: false,
      panelClass: 'filter-popup',
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log('The dialog was closed');
    });
    setTimeout(() => {
      dialogRef.close();
    }, 2500);
  }

  toggleNote(message: string): void {
    if (!this.noteOn) {
      this.openDialog();
    }
  }
  getScreenshot(): HTMLVideoElement {
    return document.getElementById('my-video') as HTMLVideoElement;
  }

  openDialog(): void {
    const filterData = {
      top: this.noteIcon.nativeElement.getBoundingClientRect().bottom,
      right: this.noteIcon.nativeElement.getBoundingClientRect().right,
      getSnip: this.getScreenshot,
    };
    let dialogRef = this.dialog.open(NoteCanvasComponent, {
      data: filterData,
      hasBackdrop: false,
      panelClass: 'filter-popup',
    });

    this.noteOn = true;
    dialogRef.afterClosed().subscribe((result) => {
      console.log('The dialog was closed');
      this.noteOn = false;
    });
  }

  startShare(): void {
    if (this.shareOn) {
      this.stopSharing();
    } else {
      this.share = document.getElementById('shared-screen') as HTMLVideoElement;
      this.shareOn = true;
      // @ts-ignore
      // navigator.mediaDevices.getDisplayMedia().then(
      //   (stream) => {
      //     this.share.srcObject = stream;
      //     console.log('Sharing screen');
      //     (<MediaStream>this.share.srcObject)
      //       .getVideoTracks()[0]
      //       .addEventListener('ended', () => {
      //         this.stopSharing();
      //       });
      //   },
      //   (error) => {
      //     console.log('Error: ' + error);
      //     this.shareOn = false;
      //   }
      // );
    }
  }

  stopSharing(): void {
    this.share.srcObject = undefined;
    this.shareOn = false;
  }

  startSlide(): void {
    if (this.slideOn) {
      this.stopSlide();
    } else {
      this.slideOn = true;
    }
  }

  stopSlide(): void {
    this.slideOn = false;
  }

  onSlideChange(number) {
    if (this.type == 'instructor') this.socket.emit('slideChange', number);
  }

  nextSlide() {
    if (this.type == 'student') this.syncWithInstr = false;
    this.slideComponent.nextButton.click();
  }

  prevSlide() {
    if (this.type == 'student') this.syncWithInstr = false;
    this.slideComponent.prevButton.click();
  }

  syncWithInstructor() {
    this.syncWithInstr = true;
    this.slideComponent.changeSlide(this.currSlideInstr);
    console.log('syncing');
  }

  changeType() {
    if (this.type == 'instructor') {
      this.type = 'student';
    } else {
      this.type = 'instructor';
    }
  }

  stopVideo(): void {
    if (this.videoOn) {
      (<MediaStream>this.localVideo.srcObject).getTracks().forEach((track) => {
        track.stop();
      });
      this.videoOn = false;
      this.localVideo.srcObject = undefined;
      this.socket.emit('disconnectFrom', { roomID: this.roomID });
      this.socket.disconnect();
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
        .post(environment.FLASK_ENDPOINT + 'image', formData)
        .subscribe(
          (res) => console.log(res),
          (err) => console.log(err)
        );
    } else {
      console.error('Video stream is not on!');
    }
  }

  /* 
    Start of WebRTC functions
  */

  startVideo() {
    if (this.videoOn) {
      this.stopVideo();
    } else {
      this.localVideo = document.createElement('video');
      var div = document.createElement('div');
      console.log('selam');
      div.setAttribute(
        'style',
        'shareOn && slideOn ? width: 23% : shareOn || slideOn ? width: 100% : width: 23%'
      );
      this.localVideo.setAttribute('id', 'my-video');
      this.localVideo.setAttribute(
        'style',
        'width: 100%; min-height: 25vh; max-height: 50vh;'
      );
      this.localVideo.autoplay = true;
      this.localVideo.muted = true;
      div.appendChild(this.localVideo);
      document.querySelector('.remote-videos').appendChild(div);
      var constraints = {
        video: true,
        audio: false,
      };
      if (navigator.mediaDevices.getUserMedia) {
        navigator.mediaDevices
          .getUserMedia(constraints)
          .then((stream) => {
            this.getUserMediaSuccess(stream);
          })
          .then(() => {
            this.setListeners();
          });
      } else {
        alert('Your browser does not support getUserMedia API');
      }
    }
  }

  setListeners() {
    this.socket.on('signal', (fromId, message) =>
      this.gotMessageFromServer(fromId, message)
    );

    //this.socket.on('connect', () => {
    this.socketId = this.socket.ioSocket.id;

    this.socket.on('user-left', (id) => {
      var video = document.querySelector('[data-socket="' + id + '"]');
      var parentDiv = video.parentElement;
      video.parentElement.parentElement.removeChild(parentDiv);
    });

    this.socket.on('user-joined', (id, count, clients) => {
      clients.forEach((socketListId) => {
        if (!this.connections[socketListId]) {
          this.connections[socketListId] = new RTCPeerConnection(
            this.iceservers
          );
          //Wait for their ice candidate
          this.connections[socketListId].onicecandidate = (event) => {
            if (event.candidate != null) {
              this.socket.emit(
                'signal',
                socketListId,
                JSON.stringify({ ice: event.candidate })
              );
            }
          };
          //Wait for their video stream
          this.connections[socketListId].ontrack = (event) => {
            this.gotRemoteStream(event, socketListId);
          };
          this.connections[socketListId].addStream(this.localStream);
          //Add the local video stream
        }
      });

      //Create an offer to connect with your local description

      if (count >= 2) {
        this.connections[id].createOffer().then((description) => {
          this.connections[id]
            .setLocalDescription(description)
            .then(() => {
              this.socket.emit(
                'signal',
                id,
                JSON.stringify({ sdp: this.connections[id].localDescription })
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

    this.socket.emit('confirm', { roomID: this.roomID });
    //})
  }

  getUserMediaSuccess(stream) {
    this.videoOn = true;
    this.localStream = stream;
    this.localVideo.srcObject = stream;
  }

  gotRemoteStream(event, id) {
    var video = document.createElement('video'),
      div = document.createElement('div');

    div.setAttribute(
      'style',
      'shareOn && slideOn ? width: 23% : shareOn || slideOn ? width: 100% : width: 23%'
    );
    video.setAttribute('data-socket', id);
    video.setAttribute(
      'style',
      'width: 100%; min-height: 25vh; max-height: 50vh;'
    );
    video.srcObject = event.streams[0];
    video.autoplay = true;
    video.muted = true;
    div.appendChild(video);
    document.querySelector('.remote-videos').appendChild(div);
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
      console.log('updating');
    }
  }
}
