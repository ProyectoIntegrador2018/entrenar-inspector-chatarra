import { Component } from '@angular/core';
import { ExamPage } from '../exam/exam.page';
import { ModalController } from '@ionic/angular';
import { AlertController } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page {

  loginToken = "";
  serverAddress = "";
  exams: any = [];
  examSelect: any;
  headers: any;

  constructor(private http: HttpClient, public modalController: ModalController, public alertController: AlertController, private storage: Storage) {}

  async ionViewWillEnter(){

    await this.storage.get('loginToken').then((val) => {
      if (val != "" && val != undefined){
       this.loginToken = val;
       this.headers = new HttpHeaders({'auth_key': this.loginToken});
      }
    });

    await this.storage.get('serverAddress').then((val) => {
      if (val != "" && val != undefined){
       this.serverAddress = val;
      }
    });

    // get list of current exams from server
    this.exams = await this.http.get(this.serverAddress + "/exams/monthly", {'headers': this.headers}).toPromise();

  }

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
    if(this.examSelect == undefined){
      this.errorAlert();
    }
    else{
      const modal = await this.modalController.create({
        component: ExamPage,
        componentProps: { 
          practiceMode: false,
          currentExam: this.examSelect
        },
        cssClass: "fullscreenModal"
      });

      await modal.present(); 
    }
  }

  async errorAlert() {
    const alert = await this.alertController.create({
      header: 'Error',
      message: 'Se debe elegir un examen para continuar.',
      buttons: ['OK']
    });

    await alert.present();
  }

}
