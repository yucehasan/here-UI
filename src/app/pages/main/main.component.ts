import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.sass'],
})
export class MainComponent implements OnInit {
  upcomingClasses: any[];
  accessToken: string;
  constructor(
    private router: Router
  ) { }

  ngOnInit(): void {
    this.upcomingClasses = [
      { // will be fetched
        name: "ML",
        code: "CS464",
        time: "09.30",
        link: ""
      },
      {
        name: "PMBOK",
        code: "CS413",
        time: "13.30",
        link: ""
      }
    ];
    try {
      if(localStorage.getItem('accessToken') === undefined || localStorage.getItem('accessToken') === null){
        localStorage.setItem('accessToken', history.state.data['access_token']);
      }
      this.accessToken = localStorage.getItem('accessToken');
      if (this.accessToken === undefined || this.accessToken === null) {
        alert("You do not have access to this page");
        this.router.navigate(['auth']);

      }
      console.log("Access Token: " + this.accessToken);
    }
    catch (err) {
      alert(err);
    }
  }
}
