import { Component } from '@angular/core';
import { ToastController } from '@ionic/angular';
import { AlertController } from '@ionic/angular';
import { HttpClient, HttpParams  } from '@angular/common/http';
import { Storage } from '@ionic/storage';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})
export class Tab3Page {

  loginBool: boolean = false;
  logoutBool: boolean = true;
  
  loginUsername: any;
  loginPassword: any;
  serverAddress: any;

  constructor(private http: HttpClient, public toastController: ToastController, public alertController: AlertController, private storage: Storage) {
    this.storage.get('loginUsername').then((val) => {
      if (val != "" && val != undefined){
       this.loginUsername = val;
       this.loginBool = true;
       this.logoutBool = false;
      }
    });
    this.storage.get('serverAddress').then((val) => {
      if (val != "" && val != undefined){
       this.serverAddress = val;
      }
    });
  }

  async sendToast(toastMessage) {
    const toast = await this.toastController.create({
      message: toastMessage,
      duration: 2000
    });
    toast.present();
  }

  async login(){
    /*
    this.http.get("https://chatarrapp-api.herokuapp.com/users").subscribe((response) => {
      console.log(response);
      });
    */
    try{
      let data = {
        username: this.loginUsername,
        password: this.loginPassword
      }
      var loginResult: any = await this.http.post("https://chatarrapp-api.herokuapp.com/users/login", {username: this.loginUsername, password: this.loginPassword}).toPromise();
      //console.log(loginResult);
    }
    catch{
      this.sendToast('Error al iniciar sesión.');
    }
    
    this.sendToast('Se ha iniciado sesión. ' + loginResult.token);
    this.storage.set('loginUsername', this.loginUsername);
    this.storage.set('loginToken', loginResult.token);
    this.loginBool = true;
    this.logoutBool = false;
    //console.log(this.loginUsername + ", " + this.loginPassword);
    //console.log(loginResult);
  }

  logout(){
    this.sendToast('Se ha cerrado sesión.');
    this.storage.set('loginUsername', "");
    this.storage.set('loginToken', "");
    this.loginBool = false;
    this.logoutBool = true;
  }

  addressConfig(){
    this.sendToast('Se ha configurado la dirección del servidor.');
    this.storage.set('serverAddress', this.serverAddress);
    //console.log(this.serverAddress);
  }

  async loginAlert() {
    const alert = await this.alertController.create({
      header: 'Error',
      message: 'No se puede iniciar sesión en este momento.',
      buttons: ['OK']
    });

    await alert.present();
  }

}
