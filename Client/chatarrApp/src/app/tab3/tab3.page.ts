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

  // When creating the page
  constructor(private http: HttpClient, public toastController: ToastController, public alertController: AlertController, private storage: Storage) {

    // Obtain the username from the device storage
    this.storage.get('loginUsername').then((val) => {
      if (val != "" && val != undefined){
       this.loginUsername = val;
       this.loginBool = true;
       this.logoutBool = false;
      }
    });

    // Obtain the server address from the device storage
    this.storage.get('serverAddress').then((val) => {
      if (val != "" && val != undefined){
       this.serverAddress = val;
      }
    });
  }

  // Send a toast message to the user with the sent message
  async sendToast(toastMessage) {
    const toast = await this.toastController.create({
      message: toastMessage,
      duration: 2000
    });
    toast.present();
  }

  // Obtain login token from the server using the login username and password
  async login(){

    // Using the entered username and password, send to the login server and obtain the result
    try{
      let data = {
        username: this.loginUsername,
        password: this.loginPassword
      }
      var loginResult: any = await this.http.post(this.serverAddress + "/users/login", {username: this.loginUsername, password: this.loginPassword}).toPromise();
    }

    // If the result contains an error, show a toast notification with an error message
    catch{
      this.sendToast('Error al iniciar sesión.');
      return;
    }
    
    // If an error was not found, show the user a toast with a success message, and save the username and token
    this.sendToast('Se ha iniciado sesión.');
    this.storage.set('loginUsername', this.loginUsername);
    this.storage.set('loginToken', loginResult.token);
    this.loginBool = true;
    this.logoutBool = false;
  }

  // If the user clicks the logout button, show the logout mesage 
  // and delete the username and token from the device storage
  logout(){
    this.sendToast('Se ha cerrado sesión.');
    this.storage.set('loginUsername', "");
    this.storage.set('loginToken', "");
    this.loginBool = false;
    this.logoutBool = true;
  }

  // If the user submits a server address, show a success toast message
  addressConfig(){
    this.sendToast('Se ha configurado la dirección del servidor.');
    this.storage.set('serverAddress', this.serverAddress);
  }

}
