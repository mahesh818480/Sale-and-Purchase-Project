import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { AlertyfyService } from '../services/alertyfy.service';
import { ScreenShareService } from '../screen-share.service';
import { AngularFirestore } from '@angular/fire/compat/firestore';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {
  arr: any=[];
  popUp=false;

 /*  constructor(private http:HttpClient,private alerty:AlertyfyService){
    
  }
  ngOnInit(){
    
  }
  getData(){
    // this.popUp = true;
    // this.alerty.PopUp('hello');
  } */
   localStream!: MediaStream;
  peerConnection!: RTCPeerConnection;
  roomId!: string;

  servers = {
    iceServers: [
      { urls: ['stun:stun.l.google.com:19302'] }
    ]
  };

  constructor(private screenShareService: ScreenShareService, private firestore: AngularFirestore) {}

  async ngOnInit() {}

  async startScreenShare() {
    this.localStream = await this.screenShareService.startCapture();
    const localVideo = document.querySelector('video#localVideo') as HTMLVideoElement;
    localVideo.srcObject = this.localStream;

    this.peerConnection = new RTCPeerConnection(this.servers);

    // Add local tracks to peer connection
    this.localStream.getTracks().forEach(track => {
      this.peerConnection.addTrack(track, this.localStream);
    });

    // Create a Firestore room for signaling
    const roomRef = this.firestore.collection('rooms').doc();
    this.roomId = roomRef.ref.id;

    // ICE candidates collection
    const callerCandidatesCollection = roomRef.collection('callerCandidates');

    // Listen for ICE candidates and add them to Firestore
    this.peerConnection.onicecandidate = event => {
      if (event.candidate) {
        callerCandidatesCollection.add(event.candidate.toJSON());
      }
    };

    // Create offer
    const offer = await this.peerConnection.createOffer();
    await this.peerConnection.setLocalDescription(offer);

    // Save offer to Firestore
    const roomWithOffer = {
      offer: {
        type: offer.type,
        sdp: offer.sdp
      }
    };
    await roomRef.set(roomWithOffer);

    // Listen for remote answer
    roomRef.snapshotChanges().subscribe(async snapshot => {
      const data = snapshot.payload.data() as any;
      if (!this.peerConnection.currentRemoteDescription && data?.answer) {
        const answerDescription = new RTCSessionDescription(data.answer);
        await this.peerConnection.setRemoteDescription(answerDescription);
      }
    });

    // Listen for remote ICE candidates
    roomRef.collection('calleeCandidates').snapshotChanges().subscribe(snapshot => {
      snapshot.forEach(async change => {
        if (change.type === 'added') {
          const candidate = new RTCIceCandidate(change.payload.doc.data());
          await this.peerConnection.addIceCandidate(candidate);
        }
      });
    });

    // When remote track arrives, show it in remote video element
    this.peerConnection.ontrack = event => {
      const remoteVideo = document.querySelector('video#remoteVideo') as HTMLVideoElement;
      if (remoteVideo.srcObject !== event.streams[0]) {
        remoteVideo.srcObject = event.streams[0];
      }
    };
  }

}
