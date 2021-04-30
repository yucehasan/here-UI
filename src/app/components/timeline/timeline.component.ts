
import { Component, ElementRef, OnInit } from '@angular/core';

@Component({
  selector: 'app-timeline',
  templateUrl: './timeline.component.html',
  styleUrls: ['./timeline.component.sass']
})
export class TimelineComponent implements OnInit {
  timeline = [
    1619780400, 1619780700, 1619781000,	1619781180, 1619781300
  ];
  minutes= [];
  firstTitle: string;
  firstMin: string;
  secondTitle: string;
  secondMin: string;
  thirdTitle: string;
  thirdMin: string;
  fourthTitle: string;
  fourthMin: string;
  fifthTitle: string;
  fifthMin: string;
  constructor(private elementRef: ElementRef) { }

  ngOnInit(): void {
    this.timestampToMins();
    var first = this.minutes[0];
    var last = this.minutes[this.minutes.length - 1];
    var gap = ((last - first) / 5) + 1 ; 
    var index = 0
    var end = 1;
    var start = 0;
    var j = 0;
    var arr = [0,0,0,0,0];
    

    for (let i = 0; i < 5; i++){
      var min = first + gap * end;
      if ( min >= 10){
        min = min + ":00"
      }
      else{
        min = "0" + min + ":00"
      }
      if(i == 0){
        this.firstMin = min;
      }
      else if(i == 1){
        this.secondMin = min;
      }
      else if(i == 2){
        this.thirdMin = min;
      }
      else if(i == 3){
        this.fourthMin = min;
      }
      else if(i == 4){
        this.fifthMin = min;
      }
      while(this.minutes[index] >= (first + gap * start) && this.minutes[index] <= (first + gap * end)){
        arr[i]++;
        index++;
      }
      start++;
      end++;
    }
    
    for(let i = 0; i < 5; i++){
      var title = "Distracted students: " + arr[i] + ".";
      if(i == 0){
        this.firstTitle = title;
      }
      else if(i == 1){
        this.secondTitle = title;
      }
      else if(i == 2){
        this.thirdTitle = title;
      }
      else if(i == 3){
        this.fourthTitle = title;
      }
      else if(i == 4){
        this.fifthTitle = title;
      }
    }
  }

  timestampToMins(): void {
    for (var val of this.timeline) {
      var date = new Date(val * 1000);
      var min = "0" + date.getMinutes();
      this.minutes.push(Number(min));
    }
  }

}
