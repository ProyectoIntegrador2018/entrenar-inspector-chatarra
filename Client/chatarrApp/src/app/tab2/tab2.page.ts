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
  serverAddress = "empty";

  constructor(private http: HttpClient, private storage: Storage) {
    this.resultsTime = "month"
    //this.setUpTest();
    this.getScores();
  }

  async getStorage(){
    await this.storage.get('loginToken').then((val) => {
      if (val != "" && val != undefined){
       this.loginToken = val;
      }
    });

    await this.storage.get('serverAddress').then((val) => {
      if (val != "" && val != undefined){
       this.serverAddress = val;
      }
    });
  }

  async getScores(){
    var scores: any;

    await this.getStorage();

    const headers = new HttpHeaders({'auth_key': this.loginToken});
    if(this.resultsTime == "week"){
      scores = await this.http.get(this.serverAddress + "/attempts/scoresWeek", {'headers': headers}).toPromise();
    }
    if(this.resultsTime == "month"){
      scores = await this.http.get(this.serverAddress + "/attempts/scores", {'headers': headers}).toPromise();
    }
    if(this.resultsTime == "previousMonth"){
      scores = await this.http.get(this.serverAddress + "/attempts/scoresPast", {'headers': headers}).toPromise();
    }
    //console.log(scores);
    this.results = [];
    for(var entry of scores){
      //console.log(entry.username + ", " + entry.score);
      this.results.push({
        name: entry.username,
        points: entry.score
      })
    }
  }

  setUpTest(){
    this.results.push({
      name: "Test Name 1",
      points: "100"
    })

    this.results.push({
      name: "Test Name 2",
      points: "90"
    })

    this.results.push({
      name: "Test Name 3",
      points: "80"
    })

    this.results.push({
      name: "Test User",
      points: "75"
    })
  }

  changeResults(){
    //console.log("Results time changed.");
    this.getScores();
  }

}
