import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { MatMenuTrigger } from '@angular/material/menu';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-conference',
  templateUrl: './conference.component.html',
  styleUrls: ['./conference.component.sass'],
})
export class ConferenceComponent implements OnInit {

  @ViewChild('taTrigger') taTrigger: MatMenuTrigger;
  @ViewChild('noteTrigger') noteTrigger: MatMenuTrigger;
  taOn: boolean;
  video: HTMLVideoElement;
  share: HTMLVideoElement;
  videoOn: boolean;
  shareOn: boolean;
  noteOn: boolean;
  message: string;
  activeCalls: any[];
  peerConnection;

  localVideo;
  //socket;
  firstPerson = false;
  socketCount = 0;
  socketId;
  localStream;
  connections = [];

  iceservers: RTCConfiguration = { 
    'iceServers': [
      { 'urls': 'stun:stun.l.google.com:19302'},
      { 'urls': 'stun:stun1.l.google.com:19302'},
      { 'urls': 'stun:stun2.l.google.com:19302'},
      { 'urls': 'stun:stun3.l.google.com:19302'},
      { 'urls': 'stun:stun4.l.google.com:19302'},
    ] 
};

  constructor(
    private socket: Socket,
    private httpClient: HttpClient
  ) {}

  ngOnInit(): void {
    this.activeCalls = [];
    this.shareOn = false;
    this.taOn = false;
    this.noteOn = false;
    // this.socket = io(environment.TEST_ENDPOINT, {secure: true});
  }
  ngAfterContentInit(): void {
    this.pageReady();
    //Called after ngOnInit when the component's or directive's content has been initialized.
    //Add 'implements AfterContentInit' to the class.
    
  }

  openTA(message: string): void {
    this.taTrigger.openMenu();
    let notification = document.getElementById('ta-notification');
    notification.innerHTML = message || "message will appear here";
    this.taOn = true;
    setTimeout(() => {
      this.taTrigger.closeMenu();
      this.taOn = false;
    }, 5000);
  }

  toggleNote(message: string): void {
    if(!this.noteOn){
      this.noteTrigger.openMenu();
      this.noteOn = true; 
    }
    else{
      this.noteTrigger.closeMenu();
      this.noteOn = false; 
    }
  }

  startVideo(): void {
    this.video = document.getElementById('host-video') as HTMLVideoElement;
    this.videoOn = true;
  }

  startShare(): void {
    this.share = document.getElementById('shared-screen') as HTMLVideoElement;
    this.shareOn = true;
    // @ts-ignore
    navigator.mediaDevices.getDisplayMedia().then(
      (stream) => {
        this.share.srcObject = stream;
        console.log('Sharing screen');
        (<MediaStream>this.share.srcObject)
          .getVideoTracks()[0]
          .addEventListener('ended', () => {
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
    this.share.srcObject = undefined;
    this.shareOn = false;
  }

  stopVideo(): void {
    if (this.videoOn) {
      (<MediaStream>this.video.srcObject).getTracks().forEach((track) => {
        track.stop();
      });
      this.videoOn = false;
      this.video.srcObject = undefined;
    }
  }

  captureVideo() {
    if (this.videoOn) {
      const canvas = document.createElement('canvas');
      // scale the canvas accordingly
      canvas.width = this.video.videoWidth;
      canvas.height = this.video.videoHeight;
      // draw the video at that frame
      canvas
        .getContext('2d')
        .drawImage(this.video, 0, 0, canvas.width, canvas.height);
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
  
  pageReady() {
      this.localVideo = document.getElementById('host-video');
  
      var constraints = {
        video: true,
        audio: false,
      };
  
      if(navigator.mediaDevices.getUserMedia) {
          navigator.mediaDevices.getUserMedia(constraints)
              .then((stream) => {this.getUserMediaSuccess(stream)})
              .then( () => {this.setListeners()}); 
      } else {
          alert('Your browser does not support getUserMedia API');
      } 
  }

  setListeners(){
    this.socket.on('signal', (fromId, message) => this.gotMessageFromServer(fromId, message)); 

    //this.socket.on('connect', () => {
      this.socketId = this.socket.ioSocket.id;

      this.socket.on('user-left', (id) => {
          var video = document.querySelector('[data-socket="'+ id +'"]');
          var parentDiv = video.parentElement;
          video.parentElement.parentElement.removeChild(parentDiv);
        });


        this.socket.on('user-joined', (id, count, clients) => {
            clients.forEach((socketListId) => {
                if(!this.connections[socketListId]){
                  this.connections[socketListId] = new RTCPeerConnection(this.iceservers);
                    //Wait for their ice candidate    
                    this.connections[socketListId].onicecandidate = (event) => {
                        if(event.candidate != null) {
                            this.socket.emit('signal', socketListId, JSON.stringify({'ice': event.candidate}));
                        }
                    }
                    //Wait for their video stream
                    this.connections[socketListId].ontrack = (event) => {
                      this.gotRemoteStream(event, socketListId);
                    }    
                    this.connections[socketListId].addStream(this.localStream);                                                                
                    //Add the local video stream
                }
            });

            //Create an offer to connect with your local description
            
            if(count >= 2){
              this.connections[id].createOffer().then((description) => {
                this.connections[id].setLocalDescription(description).then(() => {
                        this.socket.emit('signal', id, JSON.stringify({'sdp': this.connections[id].localDescription}));
                    }).catch(e => console.log(e));        
                });
            }
        });  

        // this.socket.on('confirm', () => {
        //   console.log("confirmed");
        // });
      this.socket.emit("confirm");
    //})       

}
  
  getUserMediaSuccess(stream) {
    this.localStream = stream;
    this.localVideo.srcObject = (stream);
  }
  
  gotRemoteStream(event, id) {
      var video  = document.createElement('video'),
          div    = document.createElement('div')
  
      video.setAttribute('data-socket', id);
      video.setAttribute("style", "width: 100%");
      video.srcObject         = event.streams[0];
      video.autoplay    = true; 
      video.muted       = true;
      
      div.setAttribute("style", "width: 23%");
      div.appendChild(video);      
      document.querySelector('.remote-videos').appendChild(div);       
  }
  
  gotMessageFromServer(fromId, message) {
  
      //Parse the incoming signal
      var signal = JSON.parse(message)
  
      //Make sure it's not coming from yourself
      if(fromId != this.socketId) {
          if(signal.sdp){            
            this.connections[fromId].setRemoteDescription(new RTCSessionDescription(signal.sdp)).then(() => {                
                  if(signal.sdp.type == 'offer') {
                    this.connections[fromId].createAnswer().then((description) => {
                      this.connections[fromId].setLocalDescription(description).then(() => {
                        this.socket.emit('signal', fromId, JSON.stringify({'sdp': this.connections[fromId].localDescription}));
                          }).catch(e => console.log(e));        
                      }).catch(e => console.log(e));
                  }
              }).catch(e => console.log(e));
          }
      
          if(signal.ice) {
            this.connections[fromId].addIceCandidate(new RTCIceCandidate(signal.ice)).catch(e => console.log(e));
          }                
      }
  }


}
