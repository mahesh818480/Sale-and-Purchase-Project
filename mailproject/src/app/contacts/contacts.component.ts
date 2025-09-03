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
    });

    this.commonService.getSenderMsg().subscribe((res) =>{
      console.log(res,'tesr')
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
}
