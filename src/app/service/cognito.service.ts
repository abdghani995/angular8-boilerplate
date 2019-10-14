import { Injectable } from '@angular/core';
import { environment } from "../../environments/environment";
import { CognitoUserPool } from "amazon-cognito-identity-js";
import { AuthenticationDetails, CognitoUser, CognitoUserSession, CognitoUserAttribute } from "amazon-cognito-identity-js";
import { Router} from "@angular/router";

import * as AWS from "aws-sdk/global";
import * as awsservice from "aws-sdk/lib/service";
import * as CognitoIdentity from "aws-sdk/clients/cognitoidentity";
import { Subject } from 'rxjs';

export interface Callback {
  callback(): void;
  callbackWithParam(result: any): void;
}
export interface CognitoCallback {
  cognitoCallback(message: string, result: any): void;
}
export interface LoggedInCallback {
  isLoggedIn(message: string, loggedIn: boolean): void;
}

@Injectable({
  providedIn: 'root'
})
export class CognitoService {

  public isLoggedIn = new Subject<Boolean>();
  public static _REGION = environment.region;
  public static _USER_POOL_ID = environment.userPoolId;
  public static _CLIENT_ID = environment.clientId;

  constructor(public router: Router,) {

    this.isLoggedIn.subscribe({
      next: (authenticated) => {
        if(authenticated == true){router.navigate(['/groups','view'])}
        else{console.log("---");
         router.navigate(['/login'])}
      }
    });

  }

  public static _POOL_DATA: any = {
    UserPoolId: CognitoService._USER_POOL_ID,
    ClientId: CognitoService._CLIENT_ID
  };

  getUserPool() {
    return new CognitoUserPool(CognitoService._POOL_DATA);
  }

  getCurrentUser() {
    return this.getUserPool().getCurrentUser();
  }

  getAccessToken(cb): void {
    if (this.getCurrentUser() != null) {
      this.getCurrentUser().getSession(function (err, session) {
        if (err) {
          console.log("CognitoUtil: Can't set the credentials:" + err);
          cb(err);
        } else {
          if (session.isValid()) {
            cb(null, session.getAccessToken().getJwtToken());
          }
        }
      });
    } else {
      cb("User missing");
    }
  }

  getSession() {
    return new Promise((resolve, reject) => {
        if (this.getCurrentUser() != null) {
          this.getCurrentUser().getSession(function (err, session) {
            if (err) {
              resolve(err);
            } else {
              if (session.isValid()) {
                resolve(session)
              }
            }
          });
        } else {
          resolve("User missing");
        }
    })
  }

  getRefreshToken(callback: Callback): void {
    if (callback == null) {
      throw ("CognitoUtil: callback in getRefreshToken is null...returning");
    }
    if (this.getCurrentUser() != null)
      this.getCurrentUser().getSession(function (err, session) {
        if (err) {
          console.log("CognitoUtil: Can't set the credentials:" + err);
          callback.callbackWithParam(null);
        } else {
          if (session.isValid()) {
            callback.callbackWithParam(session.getRefreshToken());
          }
        }
      });
    else
      callback.callbackWithParam(null);
  }

  refresh(): void {
    this.getCurrentUser().getSession(function (err, session) {
      if (err) {
        console.log("CognitoUtil: Can't set the credentials:" + err);
      } else {
        if (session.isValid()) {
          console.log("CognitoUtil: refreshed successfully");
        } else {
          console.log("CognitoUtil: refreshed but session is still not valid");
        }
      }
    });
  }

  authenticate(username: string, password: string, cb: any) {
      console.log("UserLoginService: starting the authentication");

      let authenticationData = {
          Username: username,
          Password: password,
      };
      let authenticationDetails = new AuthenticationDetails(authenticationData);

      let userData = {
          Username: username,
          Pool: this.getUserPool()
      };

      let cognitoUser = new CognitoUser(userData);
      
      cognitoUser.authenticateUser(authenticationDetails, {
          onSuccess: result => {
            // this.isLoggedIn.next(true);
            cb(null, result)
          },
          onFailure: err => {
            cb(err)
          }
      });
  }

  isAuthenticated(cb) {
    let cognitoUser = this.getCurrentUser();
    if (cognitoUser != null) {
      cognitoUser.getSession(function (err, session) {
        if (err) {
            console.log("UserLoginService: Couldn't get the session: " + err, err.stack);
            cb(err, false);
        }
        else {
            console.log("UserLoginService: Session is " + session.isValid());
            cb(err, session.isValid());
        }
      });
    } else {
      cb("Can't retrieve the CurrentUser");
    }
  }

  isAuthenticatedPromise() {
    return new Promise((resolve, reject) => {
        let cognitoUser = this.getCurrentUser();
        if (cognitoUser != null) {
          cognitoUser.getSession(function (err, session) {
            if (err) {
                // console.log("UserLoginService: Couldn't get the session: " + err, err.stack);
                // cb(err, false);
                reject(err);
            }
            else {
                // console.log("UserLoginService: Session is " + session.isValid());
                resolve(session.isValid())
            }
          });
        } else {
          reject("Can't retrieve the CurrentUser");
        }
    })
  }

  isLoggedInCheck() {
    this.getAccessToken((err, data) =>{
      if(err){
        this.isLoggedIn.next(false);
      }else{
        this.isLoggedIn.next(true);
      }
    })
  }

  logout(){
    // if(this.getCurrentUser()){
      this.getCurrentUser().signOut();
      this.isLoggedIn.next(false);
      this.router.navigate(['/login']);
    // }else{
    //   this.router.navigate(['/login']);
    // }
  }
  
}
