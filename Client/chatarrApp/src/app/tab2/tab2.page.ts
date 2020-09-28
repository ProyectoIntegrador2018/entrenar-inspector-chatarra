import { Component } from '@angular/core';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page {

  resultsTime: any;
  results: any = [];

  constructor() {
    this.resultsTime = "week"
    this.setUpTest();
    this.getResults();
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

  getResults() {
    //get results from server
    /*
    this.http.get(this.apiURL).subscribe((response) => {
      this.results = response;
      });
    */
    if(this.resultsTime == "week"){
      
    }

    if(this.resultsTime == "month"){
      
    }

    if(this.resultsTime == "previousMonth"){
      
    }
  }

  changeResults(){
    console.log("Results time changed.");
    this.getResults()
  }

}
