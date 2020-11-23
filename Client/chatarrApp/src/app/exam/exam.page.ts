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

  // Each set contains imageurl y clasificacion, in the form of .image and .class
  sets: any = [];

  currentNum = 1;
  totalNum = 0;

  // Possible classifications
  possibleAnswers = ["Chatarra Nacional Primera", "Chicharron Nacional", "Placa y Estructura Nacional", "Rebaba de Acero", 
  "Regreso Industrial Galvanizado Nacional", "Mixto Cizallado", "Mixto Para Procesar"];
  options = ["", "", "", ""];

  currentImage = "";
  currentClass = "TYPEA";

  loginUsername = "";
  loginToken = "";
  serverAddress = "";

  currentExam: any;

  headers: any;

  practiceLives = 3;

  constructor(private http: HttpClient, public modalController: ModalController, public alertController: AlertController, private storage: Storage) { }

  // Antes de entrar a la pantalla
  async ionViewWillEnter(){

    // If practice mode is on, hide the question number
    if(this.practiceMode){
      this.hideQuestionNum = true;
    }

    // Obtain the username from the device storage
    await this.storage.get('loginUsername').then((val) => {
      if (val != "" && val != undefined){
       this.loginUsername = val;
      }
    });

    // Obtain the login token from the device storage
    await this.storage.get('loginToken').then((val) => {
      if (val != "" && val != undefined){
       this.loginToken = val;
       this.headers = new HttpHeaders({'auth_key': this.loginToken});
      }
    });

    // Obtain the server address from the device storage
    await this.storage.get('serverAddress').then((val) => {
      if (val != "" && val != undefined){
       this.serverAddress = val;
      }
    });

    // If practice mode is on, change set the title to Practice
    if(this.practiceMode){
      this.title = "Práctica";
    }
    // Otherwise set it to Else
    else{
      this.title = "Examen";
    }

    await this.setUpTest();
    this.setUpQuestion();

  }

  ngOnInit() {
  }

  // Loads questions and images from the selected test or mode
  async setUpTest(){

    // If practice mode is off, load each image and its class from the selected exam to the list
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
        this.sets.push({
          image: imageInfo.imageURL,
          id: imageInfo._id,
          class: imageInfo.classification
        })
        this.totalNum++;
      }
    }

    // If practice mode is on, load each image from the whole list of images to the list
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

  // Obtained from https://github.com/Daplie/knuth-shuffle
  shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;

    while (0 !== currentIndex) {
  
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;
  
      temporaryValue = array[currentIndex];
      array[currentIndex] = array[randomIndex];
      array[randomIndex] = temporaryValue;
    }
  
    return array;
  }

  // For each question, get its selected classification and possible options
  setUpQuestion(){
    this.currentImage = this.sets[this.currentNum - 1].image;
    this.currentClass = this.sets[this.currentNum - 1].class.toUpperCase();

    // Setup options while avoiding repetitions
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
    
    // Shuffle possible options
    this.options = this.shuffle(this.options);
  }

  // When answering a question
  answer(option){
    this.currentNum++;

    // Check if the option is correct, if so add it to correct counter
    if(this.options[option].toUpperCase() == this.currentClass.toUpperCase()){
      this.correct++;
      this.answerCard = "Correcto, es " + this.currentClass;
    }
    // If the option is incorrect, subtract the lives counter
    else{
      this.answerCard = "Incorrecto, es " + this.currentClass;
      this.practiceLives--;
    }

    this.showingResults = true;
    this.hideQuestionNum = true;
    this.questionActive = false;
  }

  // Show the results for the answered question
  nextQuestion(){
    this.showingResults = false;
    if(this.practiceMode == false){
      this.hideQuestionNum = false;
    }
    this.questionActive = true;

    // If practice mode is on
    if(this.practiceMode){
      
      // If the lives have run out, go to results screen
      if(this.practiceLives <= 0){
        this.sendResults();
      }

      // If the lives have not run out and the limit of questions have been reached, 
      // loop back to first one while shuffling, then proceed to next question
      else if(this.currentNum >= this.totalNum){
        this.sets = this.shuffle(this.sets);
        this.currentNum = 0;
        this.setUpQuestion();
      }

      // If lives have not run out, proceed to next question
      else{
        this.setUpQuestion();
      }
    }

    // If practice mode is not on
    else{

      // If there are still questions remaining, go to next one
      if(this.currentNum <= this.totalNum){
        this.setUpQuestion();
      }

      // If there are no questions remaining, show results
      else{
        this.sendResults();
      }
    }
  }

  // Show results
  async sendResults(){
    this.showingResults = true;
    this.currentNum--;
    this.currentImage = "";

    // If practice mode is on, show standard result message
    if(this.practiceMode == true){
      this.resultsString = "Tu resultado es de " + this.correct + " puntos.";
    }

    // If practice mode is not on, show result message while sending results to server
    else{
      var attemptResult = await this.http.post(this.serverAddress + "/attempts/updateAttempt", {username: this.loginUsername, examID: this.currentExam._id, 
        score: Math.floor((this.correct/this.totalNum)*100), date: new Date()}, {'headers': this.headers}).toPromise();
      this.resultsString = "Tu resultado es de " + this.correct + " de " + this.totalNum + ". Te invitamos a ir a la pestaña de resultados.";
    }
  }

  // Go back to exam selection screen
  dismiss(){
    this.modalController.dismiss();
  }

  // Report question with message
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
              // Send queston id and message to server
              var reportResult = await this.http.post(this.serverAddress + "/reports/add", {username: this.loginUsername, report: data.mensaje, imageID: this.sets[this.currentNum - 1].id}, {'headers': this.headers}).toPromise();
            }
        }
    ]
    });

    await alert.present();
  }

}
