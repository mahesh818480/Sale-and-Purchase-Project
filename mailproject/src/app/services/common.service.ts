import { HttpClient } from '@angular/common/http';
import { Injectable, OnInit } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CommonService implements OnInit {
  data: any = [];

  private apiUrl = 'https://vigilant-enigma-qw4v5ggr76rf9xr5-3000.app.github.dev/';

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    // Avoid calling getHouseData with 'eval'
    this.Favourite.subscribe(res => {
      this.data = res;
    });
  }

  HouserentDetails = new BehaviorSubject([]);
  Favourite = new BehaviorSubject([]);
  UserLogin = new BehaviorSubject('');

  myadds = new BehaviorSubject([]);
  updatemyadds(myadd: any) {
    this.myadds.next(myadd);
  }

  createHouseData = new BehaviorSubject([]);
  getCreateHouseData(data: any) {
    this.createHouseData.next(data);
  }

  favouriteData(val: any) {
    this.data = [...this.data, ...val];
    this.Favourite.next(this.data);
  }

  getHouseData(val: any) {
    this.HouserentDetails.next(val);
  }

  getJsonData() {
    return this.http.get('assets/Houses.json');
  }

  UserBehavior(data: any) {
    this.UserLogin.next(data);
  }

  // <<< DB register Data >>>
  registerData() {
    return this.http.get(this.apiUrl + 'api/register');
  }

  updateRegisterData(data: any) {
    return this.http.post(this.apiUrl + 'api/update/register', data);
  }

  getDBHouseData() {
    return this.http.get(this.apiUrl + 'api/house');
  }

  updateHouseData(data: any) {
    console.log(data,'67:::')
    return this.http.post(this.apiUrl + 'api/update/house', data);
  }

  updateFavData(data: any) {
    return this.http.post(this.apiUrl + 'api/update/favdata', data);
  }

  sendOtp(to: string): Observable<any> {
    return this.http.post(this.apiUrl + 'send-otp', { to });
  }
}
