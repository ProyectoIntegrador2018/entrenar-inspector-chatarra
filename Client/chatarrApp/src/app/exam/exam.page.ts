import { Component, OnInit } from '@angular/core';
import { ModalController, AlertController } from '@ionic/angular';
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
  totalNum = this.sets.length;

  //possibleAnswers: string[] = [];
  possibleAnswers = ["Tipo1", "Tipo2", "Tipo3", "Tipo4", "Tipo5", "Tipo6", "Tipo7"];
  options = ["", "", "", ""];

  //apiURL = '';

  currentImage = "";
  currentClass = "Tipo1";

  constructor(public modalController: ModalController, public alertController: AlertController) { }

  ionViewWillEnter(){
    if(this.practiceMode){
      this.title = "Práctica";
    }
    else{
      this.title = "Examen";
    }

    this.setUpTest();
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

  setUpTest(){
    this.sets.push({
      image: "https://www.ecoticias.com/userfiles/extra/JOFN_chatarraaceroalu.jpg",
      class: "Tipo6"
    })

    this.sets.push({
      image: "https://st.depositphotos.com/1010263/2955/i/450/depositphotos_29553943-stock-photo-scrap-metal-heap.jpg",
      class: "Tipo3"
    })

    this.totalNum = this.sets.length;
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
    this.currentImage = this.sets[this.currentNum - 1].image;
    this.currentClass = this.sets[this.currentNum - 1].class;

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
    if(this.options[option] == this.currentClass){
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
      this.showingResults = true;
      //console.log("REACHED END");
      this.currentNum--;
      this.currentImage = "";
      if(this.practiceMode == true){
        this.resultsString = "Tu resultado es de " + this.correct + " de " + this.totalNum + ".";
      }
      else{
        //send results to server
        this.resultsString = "Tu resultado es de " + this.correct + " de " + this.totalNum + ". Te invitamos a checar los resultados";
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
            handler: data => {
              console.log(this.currentNum - 1 + ", " + data.mensaje)
              //enviar a servidor id y mensaje
            }
        }
    ]
    });

    await alert.present();
  }

}
