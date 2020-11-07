import { Component, OnInit } from '@angular/core';
import { ModalController, AlertController } from '@ionic/angular';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Storage } from '@ionic/storage';
//import { setServers } from 'dns';

@Component({
  selector: 'app-exam',
  templateUrl: './exam.page.html',
  styleUrls: ['./exam.page.scss'],
})
export class ExamPage implements OnInit {

  public practiceMode: boolean
  public title: string

  showingResults = false;
  questionActive = true;
  answerCard = "empty";

  correct = 0;
  resultsString = "";

  sets: any = [];
  //each set contains imageurl and classification, so .image and .class

  currentNum = 1;
  totalNum = 0;

  //possibleAnswers: string[] = [];
  possibleAnswers = ["TYPEA", "TYPEB", "TYPEC", "TYPED", "TYPEE", "TYPEF", "TYPEG"];
  options = ["", "", "", ""];

  //apiURL = '';

  currentImage = "";
  currentClass = "TYPEA";

  loginUsername = "";
  loginToken = "";
  serverAddress = "";

  currentExam: any;

  headers: any;

  constructor(private http: HttpClient, public modalController: ModalController, public alertController: AlertController, private storage: Storage) { }

  async ionViewWillEnter(){

    await this.storage.get('loginUsername').then((val) => {
      if (val != "" && val != undefined){
       this.loginUsername = val;
      }
    });

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

    if(this.practiceMode){
      this.title = "Práctica";
    }
    else{
      this.title = "Examen";
    }

    await this.setUpTest();
    this.setUpQuestion();

    //get set from server
    /*
    this.http.get(this.apiURL).subscribe((response) => {
      this.sets = response;
      });
    */

    //save possible answers to possibleAnswers if they will vary
  }

  ngOnInit() {
  }

  async setUpTest(){
    var exams = await this.http.get(this.serverAddress + "/exams", {'headers': this.headers}).toPromise();
    this.currentExam = exams[2];
    console.log(this.currentExam);
    for (var image of this.currentExam.images){
      var imageInfo: any = await this.http.get(this.serverAddress + "/images/" + image, {'headers': this.headers}).toPromise();
      //console.log(imageInfo._id);
      this.sets.push({
        image: imageInfo.imageURL,
        id: imageInfo._id,
        class: imageInfo.classification
      })
      this.totalNum++;
    }
  }

  //Obtained from https://github.com/Daplie/knuth-shuffle
  shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;
  
    // While there remain elements to shuffle...
    while (0 !== currentIndex) {
  
      // Pick a remaining element...
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;
  
      // And swap it with the current element.
      temporaryValue = array[currentIndex];
      array[currentIndex] = array[randomIndex];
      array[randomIndex] = temporaryValue;
    }
  
    return array;
  }

  setUpQuestion(){
    //console.log(this.possibleAnswers.length - 1);
    console.log(this.sets);
    console.log(this.totalNum);
    this.currentImage = this.sets[this.currentNum - 1].image;
    this.currentClass = this.sets[this.currentNum - 1].class.toUpperCase();

    //setup options
    this.options[0] = this.currentClass;
    var index = 1;
    var newClass = this.currentClass;
    while(index < this.options.length){
      newClass = this.currentClass;
      while(this.options.includes(newClass)){
        var randomNumber = Math.floor(Math.random() * this.possibleAnswers.length);
        newClass = this.possibleAnswers[randomNumber];
      }
      this.options[index] = newClass;
      index++;
    }
    
    //shuffle options
    this.options = this.shuffle(this.options);
  }

  answer(option){
    this.currentNum++;

    //check if option is correct, if so add to correct
    if(this.options[option].toUpperCase() == this.currentClass.toUpperCase()){
      this.correct++;
      this.answerCard = "Correcto, es " + this.currentClass;
    }
    else{
      this.answerCard = "Incorrecto, es " + this.currentClass;
    }

    this.showingResults = true;
    this.questionActive = false;

    //go to next question
    //this.nextQuestion();
    
  }

  nextQuestion(){
    this.showingResults = false;
    this.questionActive = true;

    if(this.currentNum <= this.totalNum){
      this.setUpQuestion();
    }
    else{
      this.sendResults();
    }
  }

  async sendResults(){
    this.showingResults = true;
      //console.log("REACHED END");
      this.currentNum--;
      this.currentImage = "";
      if(this.practiceMode == true){
        this.resultsString = "Tu resultado es de " + this.correct + " de " + this.totalNum + ".";
      }
      else{
        //send results to server
        var attemptResult = await this.http.post(this.serverAddress + "/attempts/add", {username: this.loginUsername, exam: this.currentExam.examName, score: Math.floor((this.correct/this.totalNum)*100), date: new Date()}, {'headers': this.headers}).toPromise();
        console.log(attemptResult);
        this.resultsString = "Tu resultado es de " + this.correct + " de " + this.totalNum + ". Te invitamos a checar los resultados";
      }
  }

  dismiss(){
    this.modalController.dismiss();
  }

  async report(){
    const alert = await this.alertController.create({
      header: 'Reportar Pregunta',
      inputs: [
        {
          name: 'mensaje',
          type: 'text',
          value: "Respuesta Correcta"
        }
      ],
      buttons: [
        {
            text: 'Cancelar'
        },
        {
            text: 'Reportar',
            handler: async data => {
              console.log(this.currentNum - 1 + ", " + data.mensaje)
              //enviar a servidor id y mensaje
              var reportResult = await this.http.post(this.serverAddress + "/reports/add", {username: this.loginUsername, report: data.mensaje, imageID: this.sets[this.currentNum - 1].id}, {'headers': this.headers}).toPromise();
              console.log(reportResult);
            }
        }
    ]
    });

    await alert.present();
  }

}
