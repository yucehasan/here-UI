import { Component, OnInit } from '@angular/core';
import {RegisterComponent} from '../register/register.component';
import {LoginComponent} from '../login/login.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-heading',
  templateUrl: './heading.component.html',
  styleUrls: ['./heading.component.sass']
})
export class HeadingComponent implements OnInit {

  username: string;
  password: string;

  isHeading = true;
  isSubheading = true;
  isHeadingBtn = true;

  constructor(public dialog: MatDialog) { }

  ngOnInit() {
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

}
