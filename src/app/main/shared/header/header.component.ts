import { Component, OnInit } from '@angular/core';
import { CognitoService } from 'src/app/service/cognito.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  public user:any = {
    name: ""
  };
  
  constructor(
    public cognitoService: CognitoService
  ) { }

  ngOnInit() {
    this.fetch_user();
  }

  fetch_user(){
    this.cognitoService.getSession()
        .then( (data:any) => {
          if(data && data.idToken == undefined){
            this.cognitoService.logout();
          }else{
            console.log(data);
            
            this.user = data.idToken.payload;
            console.log(this.user);
            
          }
        }, err => {
          this.cognitoService.logout();
        })
  }

  logout(){
    this.cognitoService.logout();
  }

}
