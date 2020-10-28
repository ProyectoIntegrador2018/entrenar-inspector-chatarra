import { Component } from '@angular/core';
import { HttpClient, HttpParams  } from '@angular/common/http';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page {

  resultsTime: any;
  results: any = [];

  constructor(private http: HttpClient) {
    this.resultsTime = "month"
    //this.setUpTest();
    this.getScores();
  }

  async getScores(){
    var scores: any;
    if(this.resultsTime == "week"){
      scores = await this.http.get("https://chatarrapp-api.herokuapp.com/attempts/scoresWeek").toPromise();
    }
    if(this.resultsTime == "month"){
      scores = await this.http.get("https://chatarrapp-api.herokuapp.com/attempts/scores").toPromise();
    }
    if(this.resultsTime == "previousMonth"){
      scores = await this.http.get("https://chatarrapp-api.herokuapp.com/attempts/scoresPast").toPromise();
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
    console.log("Results time changed.");
    this.getScores();
  }

}
