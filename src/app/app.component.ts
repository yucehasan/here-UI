import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './services/auth.service';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.sass'],
})
export class AppComponent implements OnInit {
  loggedIn: boolean;
  token: string;
  constructor(private authService: AuthService, private router: Router) {
  }

  ngOnInit(): void {
    this.authService.getToken().subscribe(token => {
      this.token = token;
      if (this.token === "") {
        this.loggedIn = false;
      }
      else{
        this.loggedIn = true;
      }
    })
    if (this.loggedIn) {
      this.router.navigate(['main']);
    }
  }
  
}