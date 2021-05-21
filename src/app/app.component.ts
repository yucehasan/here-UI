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
    
  }
  
}