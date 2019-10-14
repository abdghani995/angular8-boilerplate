import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from "@angular/router";
// import { Observable } from 'rxjs/Observable';
import { CognitoService } from './cognito.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthguardService implements CanActivate{

  constructor(public router: Router, public cognitoService: CognitoService) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean{
      return this.cognitoService.isAuthenticatedPromise()
          .then((authenticated: boolean) => {
              if(!authenticated){
                return false;
              }else{
                return true;
              }
          })
          .catch(err => false)
    }
}
