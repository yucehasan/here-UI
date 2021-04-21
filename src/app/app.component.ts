import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.sass']
})
export class AppComponent {
  username: string;
  token: string;
  loggedIn: boolean;
  constructor(private router: Router) {
    this.username = "John Doe";
    this.loggedIn = true;
  }

  login(username: string, token: string) {
    this.username = username;
    this.token = token;
    this.loggedIn = true;
  }
  
  goMain() {
    if (this.loggedIn) { this.router.navigate(['/main']); }
  }

  goProfile() {
    if (this.loggedIn) { this.router.navigate(['/profile']); }
  }

  logout() {
    if (this.loggedIn) { this.router.navigate(['/auth']); }
  }

}
