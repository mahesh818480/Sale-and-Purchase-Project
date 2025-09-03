import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ScreenShareService {

  constructor() { }
  public localStream!: MediaStream;

  async startCapture() {
    try {
      this.localStream = await (navigator.mediaDevices as any).getDisplayMedia({
        video: true,
        audio: false
      });
      return this.localStream;
    } catch (err) {
      console.error("Error: " + err);
      throw err;
    }
  }

  stopCapture() {
    this.localStream?.getTracks().forEach(track => track.stop());
  }
}
