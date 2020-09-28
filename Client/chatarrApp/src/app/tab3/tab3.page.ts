import { Component } from '@angular/core';
import { ToastController } from '@ionic/angular';

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

  constructor(public toastController: ToastController) {}

  async sendToast(toastMessage) {
    const toast = await this.toastController.create({
      message: toastMessage,
      duration: 2000
    });
    toast.present();
  }

  login(){
    this.sendToast('Se ha iniciado sesión.');
    this.loginBool = true;
    this.logoutBool = false;
    console.log(this.loginUsername + ", " + this.loginPassword);
  }

  logout(){
    this.sendToast('Se ha cerrado sesión.');
    this.loginBool = false;
    this.logoutBool = true;
  }

  addressConfig(){
    this.sendToast('Se ha configurado la dirección del servidor.');
    console.log(this.serverAddress);
  }

}
