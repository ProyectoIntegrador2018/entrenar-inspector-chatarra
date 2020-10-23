import { Component } from '@angular/core';
import { ToastController } from '@ionic/angular';
import { AlertController } from '@ionic/angular';
import { HttpClient, HttpParams  } from '@angular/common/http';

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

  constructor(private http: HttpClient, public toastController: ToastController, public alertController: AlertController) {}

  async sendToast(toastMessage) {
    const toast = await this.toastController.create({
      message: toastMessage,
      duration: 2000
    });
    toast.present();
  }

  login(){
    this.http.get("https://chatarrapp-api.herokuapp.com/users").subscribe((response) => {
      console.log(response);
      });
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

  async loginAlert() {
    const alert = await this.alertController.create({
      header: 'Error',
      message: 'No se puede iniciar sesion en este momento.',
      buttons: ['OK']
    });

    await alert.present();
  }

}
