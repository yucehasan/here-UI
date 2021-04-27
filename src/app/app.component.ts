import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.sass']
})
export class AppComponent implements OnInit {
  username: string;
  token: string;
  loggedIn: boolean;
  constructor(
    private router: Router,
    private authService: AuthService) {
    this.username = "";
    this.token = "";
    this.loggedIn = true;
  }

  ngOnInit(): void {
    this.authService.getToken().subscribe(token => {
      this.token = token;
    })

    this.authService.getUsername().subscribe(username => {
      this.username = username;
    })
  }

  login(username: string, token: string) {
    this.username = username;
    this.token = token;
    this.loggedIn = true;
  }

  goMain() {
    if (this.loggedIn) { this.router.navigate(['/main']); }
    console.log("Token: " + this.token.substr(0, 5) + "...");
  }

  goProfile() {
    if (this.loggedIn) { this.router.navigate(['/profile']); }
    console.log(this.token);
  }

  logout() {
    if (this.loggedIn) { this.router.navigate(['/auth']); }
    localStorage.clear();
    this.authService.updateToken("");
  }

}
