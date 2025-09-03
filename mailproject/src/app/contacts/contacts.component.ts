import { Component, ElementRef, ViewChild } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { CommonService } from '../services/common.service';
import { ScreenShareService } from '../screen-share.service';
import { AngularFirestore } from '@angular/fire/compat/firestore';

@Component({
  selector: 'app-contacts',
  templateUrl: './contacts.component.html',
  styleUrls: ['./contacts.component.scss']
})
export class ContactsComponent {
  registeredUsersData: any;
  chatSelecteduser: any;
  number = '+91';
  message = '';
//  Screen Sharing 

  @ViewChild('localVideo') localVideo!: ElementRef<HTMLVideoElement>;
  @ViewChild('remoteVideo') remoteVideo!: ElementRef<HTMLVideoElement>;
 localStream!: MediaStream;
  peerConnection!: RTCPeerConnection;
  roomId!: string;
joinRoomId: string = '';

  servers = {
    iceServers: [
      { urls: ['stun:stun.l.google.com:19302'] }
    ]
  };
  constructor(private authService: AuthService,
    private commonService: CommonService,
    private screenShareService: ScreenShareService,
    private firestore: AngularFirestore) { }

  ngOnInit() {
    this.authService.userData.subscribe((users) => {
      console.log(users, '14:::')
    });
    this.commonService.registerData().subscribe((users) => {
      this.registeredUsersData = users
      console.log(users, '14:::')
    });

    this.commonService.getSenderMsg().subscribe((res) => {
      console.log(res, 'tesr')
    })
  }

  send() {
    const onlyDigits = this.number.replace(/\D/g, ''); // remove non-numeric characters
    if (onlyDigits.length === 12 && this.message !== '') {
      this.commonService.sendMessage(this.number, this.message).subscribe({
        next: (res) => alert('Message Sent!'),
        error: (err) => alert('Error: ' + (err.error?.error || err.message)),
      });
    }
    else {
      let errorMessage = '';

      if (onlyDigits.length !== 12) {
        errorMessage += '📞 Please enter a valid 12-digit mobile number (including country code like 91).\n';
      }

      if (this.message.trim() === '') {
        errorMessage += '💬 Message content cannot be empty.';
      }
      alert(errorMessage);
    }
  }
async startScreenShare() {
  this.localStream = await this.screenShareService.startCapture();

  if (this.localVideo) {
    this.localVideo.nativeElement.srcObject = this.localStream;
  }

  this.peerConnection = new RTCPeerConnection(this.servers);

  this.localStream.getTracks().forEach(track => {
    this.peerConnection.addTrack(track, this.localStream);
  });

  const roomRef = this.firestore.collection('rooms').doc();
  this.roomId = roomRef.ref.id; // ✅ ఈ ID ని Console లో చూపించండి

  const callerCandidatesCollection = roomRef.collection('callerCandidates');

  this.peerConnection.onicecandidate = event => {
    if (event.candidate) {
      callerCandidatesCollection.add(event.candidate.toJSON());
    }
  };

  const offer = await this.peerConnection.createOffer();
  await this.peerConnection.setLocalDescription(offer);

  const roomWithOffer = {
    offer: {
      type: offer.type,
      sdp: offer.sdp
    }
  };

  await roomRef.set(roomWithOffer);

  console.log('✅ Room created with ID:', this.roomId);
}


async joinScreenShare(roomId: string) {
  this.peerConnection = new RTCPeerConnection(this.servers); // ✅ తప్పకుండా define చేయాలి

  const roomRef = this.firestore.collection('rooms').doc(roomId);
  const roomSnapshot = await roomRef.get().toPromise();

  const roomData = roomSnapshot?.data() as any;

  if (!roomData?.offer) {
    console.error('❌ Room does not exist or offer missing');
    return;
  }

  await this.peerConnection.setRemoteDescription(new RTCSessionDescription(roomData.offer));

  const answer = await this.peerConnection.createAnswer();
  await this.peerConnection.setLocalDescription(answer);

  await roomRef.update({ answer: { type: answer.type, sdp: answer.sdp } });

  roomRef.collection('callerCandidates').snapshotChanges().subscribe(snapshot => {
    snapshot.forEach(async change => {
      if (change.type === 'added') {
        const data = change.payload.doc.data();
        await this.peerConnection.addIceCandidate(new RTCIceCandidate(data));
      }
    });
  });

  this.peerConnection.ontrack = event => {
    if (this.remoteVideo) {
      this.remoteVideo.nativeElement.srcObject = event.streams[0];
    }
  };

  console.log('✅ Joined room:', roomId);
}



}
