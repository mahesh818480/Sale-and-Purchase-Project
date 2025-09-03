import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { SigninComponent } from './signin/signin.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {HttpClientModule } from '@angular/common/http';
import { ProductsComponent } from './products/products.component';
import { ContactsComponent } from './contacts/contacts.component';
import { GuardGuard } from './services/guard.guard';
import { AlertyfyService } from './services/alertyfy.service';
import { HomeComponent } from './home/home.component';
import { AuthService } from './services/auth.service';
import { LoaderComponent } from './loader/loader.component';
import { HousesComponent } from './houses/houses.component';
import { HouseDetailsComponent } from './house-details/house-details.component';
import { ModalPopupComponent } from './modal-popup/modal-popup.component';
import { FavouriteComponent } from './favourite/favourite.component';
import { BreadcrumbModule } from 'xng-breadcrumb';
import { CreateHousesComponent } from './create-houses/create-houses.component';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { DatePipe } from '@angular/common';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { NgxGalleryModule } from '@kolkov/ngx-gallery';
import { FileUploadModule } from 'ng2-file-upload';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { ButtonsModule } from 'ngx-bootstrap/buttons';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MyaddsComponent } from './myadds/myadds.component';
import { StoreModule } from '@ngrx/store';
import { api_Reducer } from './store/house.reducer';
import { EffectsModule } from '@ngrx/effects';
import { ApiEffects } from './store/house.effects';
import { DarkModeToggleComponent } from './dark-mode-toggle/dark-mode-toggle.component';
import { NgxOtpInputModule } from 'ngx-otp-input';
// Import AngularFire modules
// import { AngularFireModule } from '@angular/fire/compat';   // Compatibility mode recommended
import { AngularFireAuthModule } from '@angular/fire/compat/auth'; // If you need Authentication
// import { AngularFirestoreModule } from '@angular/fire/compat/firestore'; // If you use Firestore DB
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFirestoreModule } from '@angular/fire/compat/firestore';
const firebaseConfig = {
  apiKey: "AIzaSyCpxi1YzfNfn1fuLZUms9LCzcZEHXbmzlo",
  authDomain: "screensharing-c0e02.firebaseapp.com",
  projectId: "screensharing-c0e02",
  storageBucket: "screensharing-c0e02.firebasestorage.app",
  messagingSenderId: "1098847033688",
  appId: "1:1098847033688:web:afa52d81ab163e383f6d2d",
  measurementId: "G-8Q03Y7SDYM"
};

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    SigninComponent,
    ProductsComponent,
    ContactsComponent,
    HomeComponent,
    LoaderComponent,
    HousesComponent,
    HouseDetailsComponent,
    ModalPopupComponent,
    FavouriteComponent,
    CreateHousesComponent,
    MyaddsComponent,
    DarkModeToggleComponent,

  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BreadcrumbModule,
    ReactiveFormsModule,FormsModule,
    HttpClientModule,
    TabsModule.forRoot(),
    BsDatepickerModule,
    NgxOtpInputModule,
    NgxGalleryModule,
    FileUploadModule,
    BsDropdownModule,
    ButtonsModule.forRoot(),
    BrowserAnimationsModule,
    StoreModule.forRoot({data:api_Reducer}),
    EffectsModule.forRoot([ApiEffects]),
     AngularFireModule.initializeApp(firebaseConfig),  // Initialize Firebase
    AngularFireAuthModule,        // Firebase Authentication module (optional)
    AngularFirestoreModule        // Firestore module (optional)
  ],
  providers: [GuardGuard,AuthService,AlertyfyService,DatePipe],
  bootstrap: [AppComponent]
})
export class AppModule { }
