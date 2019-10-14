import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { ToastrModule } from 'ngx-toastr';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MainModule } from './main/main.module';
import { LoginComponent } from './login/login.component';
import { CognitoService } from './service/cognito.service';
import { FormsModule } from '@angular/forms';
import { AuthguardService } from './service/authguard.service';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent
  ],
  imports: [
    ToastrModule.forRoot(),
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    MainModule
  ],
  providers: [
    CognitoService,
    AuthguardService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
