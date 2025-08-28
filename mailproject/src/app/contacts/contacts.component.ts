import { Component } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { CommonService } from '../services/common.service';

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

  constructor(private authService: AuthService,private commonService: CommonService){}

  ngOnInit(){
    this.authService.userData.subscribe((users) =>{
      console.log(users,'14:::')
    });
    this.commonService.registerData().subscribe((users) =>{
      this.registeredUsersData = users
      console.log(users,'14:::')
    })
    console.log('tesr')
  }

  send() {
  this.commonService.sendMessage(this.number, this.message).subscribe({
    next: (res) => alert('Message Sent!'),
    error: (err) => alert('Error: ' + err.error?.error || err.message),
  });
} }
