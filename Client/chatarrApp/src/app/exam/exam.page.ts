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

  hideQuestionNum = false;
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
  possibleAnswers = ["Chatarra Nacional Primera", "Chicharron Nacional", "Placa y Estructura Nacional", "Rebaba de Acero", 
  "Regreso Industrial Galvanizado Nacional", "Mixto Cizallado", "Mixto Para Procesar"];
  options = ["", "", "", ""];

  //apiURL = '';

  currentImage = "";
  currentClass = "TYPEA";

  loginUsername = "";
  loginToken = "";
  serverAddress = "";

  currentExam: any;

  headers: any;

  practiceLives = 3;

  constructor(private http: HttpClient, public modalController: ModalController, public alertController: AlertController, private storage: Storage) { }

  async ionViewWillEnter(){

    if(this.practiceMode){
      this.hideQuestionNum = true;
    }

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
    //console.log(this.currentExam);
    if(this.practiceMode == false){

      var selectedImages = [];

      for (var i = 0; i < this.currentExam.size; i++) {
        var removeImageID = Math.floor(Math.random() * this.currentExam.images.length);
        selectedImages.push(this.currentExam.images[removeImageID]);
        this.currentExam.images.splice(removeImageID, 1);
      }
      
      this.currentExam.images = selectedImages.slice();


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
    else{

      var imagesList: any = await this.http.get(this.serverAddress + "/images", {'headers': this.headers}).toPromise();

      for (var image of imagesList){
        this.sets.push({
          image: image.imageURL,
          id: image._id,
          class: image.classification
        })
        this.totalNum++;
      }
      
      this.sets = this.shuffle(this.sets);

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
    //console.log(this.sets);
    //console.log(this.totalNum);
    this.currentImage = this.sets[this.currentNum - 1].image;
    this.currentClass = this.sets[this.currentNum - 1].class.toUpperCase();

    //setup options
    this.options[0] = this.currentClass;
    var index = 1;
    var newClass = this.currentClass;
    while(index < this.options.length){
      newClass = this.currentClass;
      while(this.options.includes(newClass.toUpperCase())){
        var randomNumber = Math.floor(Math.random() * this.possibleAnswers.length);
        newClass = this.possibleAnswers[randomNumber].toUpperCase();
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
      this.practiceLives--;
    }

    this.showingResults = true;
    this.hideQuestionNum = true;
    this.questionActive = false;

    //go to next question
    //this.nextQuestion();
    
  }

  nextQuestion(){
    this.showingResults = false;
    if(this.practiceMode == false){
      this.hideQuestionNum = false;
    }
    this.questionActive = true;

    if(this.practiceMode){
      if(this.practiceLives <= 0){
        this.sendResults();
      }
      else if(this.currentNum >= this.totalNum){
        this.sets = this.shuffle(this.sets);
        this.currentNum = 0;
        this.setUpQuestion();
      }
      else{
        this.setUpQuestion();
      }
    }
    else{
      if(this.currentNum <= this.totalNum){
        this.setUpQuestion();
      }
      else{
        this.sendResults();
      }
    }
  }

  async sendResults(){
    this.showingResults = true;
    //console.log("REACHED END");
    this.currentNum--;
    this.currentImage = "";
    if(this.practiceMode == true){
      this.resultsString = "Tu resultado es de " + this.correct + " puntos.";
    }
    else{
      //send results to server
      var attemptResult = await this.http.post(this.serverAddress + "/attempts/add", {username: this.loginUsername, examName: this.currentExam.examName, examID: this.currentExam._id, 
        score: Math.floor((this.correct/this.totalNum)*100), attempt: 1, date: new Date()}, {'headers': this.headers}).toPromise();
      console.log(attemptResult);
      if(attemptResult == "Attempts exceeded"){
        this.resultsString = "Se ha excedido el límite de intentos para este examen.";
      }
      else{
        this.resultsString = "Tu resultado es de " + this.correct + " de " + this.totalNum + ". Te invitamos a ir a la pestaña de resultados.";
      }
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
              //console.log(this.currentNum - 1 + ", " + data.mensaje)
              //enviar a servidor id y mensaje
              var reportResult = await this.http.post(this.serverAddress + "/reports/add", {username: this.loginUsername, report: data.mensaje, imageID: this.sets[this.currentNum - 1].id}, {'headers': this.headers}).toPromise();
              //console.log(reportResult);
            }
        }
    ]
    });

    await alert.present();
  }

}
