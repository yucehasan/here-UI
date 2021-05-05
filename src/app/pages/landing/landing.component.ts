import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.sass']
})
export class LandingComponent implements OnInit {
  token: string;
  loggedIn: boolean;

  constructor(private authService: AuthService,
    private router: Router) { }

  ngOnInit(): void {
    this.loggedIn = false;
    this.authService.getToken().subscribe(token => {
      this.token = token;
      if (this.token === "" || this.token == null){
        this.loggedIn = false;
      }
      else{
        this.loggedIn = true;
      }
    })

    if(this.loggedIn) {
      this.router.navigate(['main']);
    }
  }

}
