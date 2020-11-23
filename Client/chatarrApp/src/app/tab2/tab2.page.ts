import { Component } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Storage } from '@ionic/storage';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page {

  resultsTime: any;
  results: any = [];

  loginToken = "empty";
  loginUsername = "empty";
  serverAddress = "empty";

  // When creating the page, set default time selection to current month and get scores from said time
  constructor(private http: HttpClient, private storage: Storage) {
    this.resultsTime = "month"
    this.getScores();
  }

  // Get values from storage
  async getStorage(){

    // Obtain the login token from the device storage
    await this.storage.get('loginToken').then((val) => {
      if (val != "" && val != undefined){
       this.loginToken = val;
      }
    });

    // Obtain the username from the device storage
    await this.storage.get('loginUsername').then((val) => {
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
  }

  // Get the list of scores from server
  async getScores(){
    var scores: any;
    var userEntry: any;

    // Get values from storage
    await this.getStorage();

    // Depending on selected time, get list of scores from server, along with the user score
    const headers = new HttpHeaders({'auth_key': this.loginToken});
    if(this.resultsTime == "week"){
      scores = await this.http.get(this.serverAddress + "/attempts/scoresWeek", {'headers': headers}).toPromise();
      userEntry = await this.http.post(this.serverAddress + "/attempts/scoresWeek", {username: this.loginUsername}, {'headers': headers}).toPromise();
    }
    if(this.resultsTime == "month"){
      scores = await this.http.get(this.serverAddress + "/attempts/scores", {'headers': headers}).toPromise();
      userEntry = await this.http.post(this.serverAddress + "/attempts/scores", {username: this.loginUsername}, {'headers': headers}).toPromise();
    }
    if(this.resultsTime == "previousMonth"){
      scores = await this.http.get(this.serverAddress + "/attempts/scoresPast", {'headers': headers}).toPromise();
      userEntry = await this.http.post(this.serverAddress + "/attempts/scoresPast", {username: this.loginUsername}, {'headers': headers}).toPromise();
    }

    // Add each obtianed score to the list of scores displayed to the user
    this.results = [];
    for(var entry of scores){
      this.results.push({
        name: entry.username,
        points: entry.score
      })
    }
    
    // If the user has a score for the selected time, add it to the list of scores
    if(userEntry[0] != undefined){
      this.results.push({
        name: "Tu puntaje: " + userEntry[0].username,
        points: userEntry[0].score
      })
    }
  }

  // When the selected time is changed, obtain the corresponding list of scores
  changeResults(){
    this.getScores();
  }

}
