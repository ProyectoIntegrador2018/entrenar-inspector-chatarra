import { Component } from '@angular/core';
import { ExamPage } from '../exam/exam.page';
import { ModalController } from '@ionic/angular';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page {

  constructor(public modalController: ModalController, public alertController: AlertController) {}

  async practice(){
    const modal = await this.modalController.create({
      component: ExamPage,
      componentProps: { 
        practiceMode: true 
      },
      cssClass: "fullscreenModal"
    });

    await modal.present(); 
  }

  async exam(){
    const modal = await this.modalController.create({
      component: ExamPage,
      componentProps: { 
        practiceMode: false 
      },
      cssClass: "fullscreenModal"
    });

    await modal.present(); 
  }

  async testAlert() {
    const alert = await this.alertController.create({
      header: 'Error',
      message: 'No se puede tomar un examen en este momento.',
      buttons: ['OK']
    });

    await alert.present();
  }

}
