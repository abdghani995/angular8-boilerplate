import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';

import { CognitoService } from '../service/cognito.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  constructor(
              private router: Router,
              private cognitoService: CognitoService,
              private toastrngx: ToastrService
  ) { }

  ngOnInit() {
  }
    // Login User
    loginUser(f: NgForm){
      this.cognitoService.authenticate(
          f.value.email, 
          f.value.password,
          (err, response) => {
            if(!err){
              if(response.idToken.payload['custom:usertype'] == 'consoleuser'){
                this.router.navigate(['/app', 'onboarding'])
              }else{
                this.toastrngx.error("Invalid user", "Error Login");  
                // logout automatically
              }
            }else{
              this.toastrngx.error(err.message, "Error Login");
            }
          })
      
    }
}
