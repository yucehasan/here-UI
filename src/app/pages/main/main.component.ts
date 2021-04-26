import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from "../../services/auth.service";

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.sass'],
})
export class MainComponent implements OnInit {
  upcomingClasses: any[];
  username: string;
  token: string;

  constructor(
    private router: Router,
    private authService: AuthService
  ) {
    this.username = "";
    this.token = "";
  }

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
    this.authService.getToken().subscribe(token => {
      this.token = token;
    })

    this.authService.getUsername().subscribe(username => {
      this.username = username;
    })
    if(this.token === "") {
      alert("You are not logged in");
      this.router.navigate(['/auth']);
    }
  }
}
