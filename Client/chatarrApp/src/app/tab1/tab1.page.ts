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
  loginUsername = "";
  serverAddress = "";
  exams: any = [];
  examSelect: any;
  headers: any;

  constructor(private http: HttpClient, public modalController: ModalController, public alertController: AlertController, private storage: Storage) {}

  // Before entering page
  async ionViewWillEnter(){

    // Obtain the login token from the device storage
    await this.storage.get('loginToken').then((val) => {
      if (val != "" && val != undefined){
       this.loginToken = val;
       this.headers = new HttpHeaders({'auth_key': this.loginToken});
      }
    });

    // Obtain the username from the device storage
    this.storage.get('loginUsername').then((val) => {
      if (val != "" && val != undefined){
       this.loginUsername = val;
      }
    });

    // Obtain the server address from the device storage
    await this.storage.get('serverAddress').then((val) => {
      if (val != "" && val != undefined){
       this.serverAddress = val;
      }
    });

    // Get the list of current exams from the server
    this.exams = await this.http.get(this.serverAddress + "/exams/monthly", {'headers': this.headers}).toPromise();

  }

  // Send user to exam page with pratice mode on
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

  // Send user to exam page with pratice mode off
  async exam(){

    // Show error if an exam was not selected
    if(this.examSelect == undefined){
      this.errorAlert('Se debe elegir un examen para continuar.');
    }

    // If an exam was selected
    else{
      // Obtain the number of remaining attemtps for the selected exam
      var checkAttempt: any = await this.http.post(this.serverAddress + "/attempts/getAttempt", {username: this.loginUsername, examID: this.examSelect._id}, {'headers': this.headers}).toPromise();
      
      // Show error if the attempt limit for the selected exam was exceeded
      if(checkAttempt.attempt <= 0){
        this.errorAlert('Se ha acabado los intentos para este examen.');
      }

      // If the number of remaining attempts has not been exceeded, 
      // send the user to the exam screen with practice mode off
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
  }

  // Show an alert with the sent message
  async errorAlert(message) {
    const alert = await this.alertController.create({
      header: 'Error',
      message: message,
      buttons: ['OK']
    });

    await alert.present();
  }

}
