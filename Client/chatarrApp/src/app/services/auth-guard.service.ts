import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot } from "@angular/router";
import { Storage } from '@ionic/storage';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardService {

  constructor(private router: Router, private storage: Storage) {
    
   }
  
  async checkStorage(){
    var loginToken = "empty";
    var serverAddress = "empty";


    await this.storage.get('loginToken').then(async (val) => {
      if (val != "" && val != undefined){
        loginToken = val;
      }
    });

    await this.storage.get('serverAddress').then(async (val) => {
      if (val != "" && val != undefined){
        serverAddress = val;
      }
    });

    if(loginToken != "empty" && serverAddress != "empty"){
      return true;
    }
    else{
      return false;
    }

  }

  async canActivate(route: ActivatedRouteSnapshot){
    var authenticated: any = await this.checkStorage();

    return authenticated;
  }

}
