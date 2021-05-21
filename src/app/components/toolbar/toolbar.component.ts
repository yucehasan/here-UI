import { MediaMatcher } from '@angular/cdk/layout';
import { ChangeDetectorRef, Component, OnDestroy, Inject, OnInit} from '@angular/core';
import { SE } from '../../directives/scroll.directive';
import { MatDialog } from '@angular/material/dialog';
import { DOCUMENT } from '@angular/common';

import {RegisterComponent} from '../register/register.component';
import {LoginComponent} from '../login/login.component';
import { AuthService } from 'src/app/services/auth.service';  
import { Router } from '@angular/router';
import { EditProfileComponent } from '../edit-profile/edit-profile.component';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.sass']
})
export class ToolbarComponent implements OnDestroy, OnInit {

  username: string;
  password: string;
  token: string;
  userType: string;
  loggedIn: boolean;

  contactFabButton: any;
  bodyelement: any;
  sidenavelement: any;

  isActive = false;
  isActivefadeInDown = true;
  fixedTolbar = true;

  mobileQuery: MediaQueryList;

  private _mobileQueryListener: () => void;

  constructor(@Inject(DOCUMENT) document, changeDetectorRef: ChangeDetectorRef, media: MediaMatcher, public dialog: MatDialog, private router: Router, private authService: AuthService) {
    this.mobileQuery = media.matchMedia('(max-width: 600px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this._mobileQueryListener);
    this.username = "";
    this.token = "";
    this.userType = "";
    this.loggedIn = false;
  }

  ngOnInit(): void {
    this.authService.getToken().subscribe(token => {
      this.token = token;
      if (this.token === "" || this.token == null) {
        this.loggedIn = false;
      }
      else{
        this.loggedIn = true;
      }
    })

    this.authService.getUsername().subscribe(username => {
      this.username = username;
    })

    this.authService.getUserType().subscribe(userType => {
      this.userType = userType;
    })
    
  }

  public detectScroll(event: SE) {
    
    if (event.header) {
      this.isActive = false;
      this.isActivefadeInDown = true;
      this.fixedTolbar = true;
    }
    
    if (event.bottom) {
      this.isActive = true;
      this.isActivefadeInDown  = false;
      this.fixedTolbar = false;
    }
  }

  setToggleOn(){

    this.bodyelement = document.getElementById('nglpage');
    this.bodyelement.classList.add("scrollOff");
  }

  setToggleOff(){
    
    this.bodyelement = document.getElementById('nglpage');
    this.bodyelement.classList.remove("scrollOff");
  }
  ngOnDestroy(): void {
    this.mobileQuery.removeListener(this._mobileQueryListener);
  }

  openLoginDialog(): void {
    const dialogRef = this.dialog.open(LoginComponent, {
      width: '500px',
      data: {name: this.username, password: this.password}
    });

    dialogRef.afterClosed().subscribe(() => {
      console.log('The login dialog was closed');
    });
  }

  openRegisterDialog(): void {
    const dialogRef = this.dialog.open(RegisterComponent, {
      width: '500px',
      data: {name: this.username, password: this.password}
    });

    dialogRef.afterClosed().subscribe(() => {
      console.log('The register dialog was closed');
    });
  }

  logout() {
    this.router.navigate(['/']); 
    localStorage.clear();
    this.authService.updateToken("");
  }

  editProfile() {
    const dialogRef = this.dialog.open(EditProfileComponent, {
      width: '500px',
    });

    dialogRef.afterClosed().subscribe(() => {
      console.log('The edit profile dialog was closed');
    });
  }

}
