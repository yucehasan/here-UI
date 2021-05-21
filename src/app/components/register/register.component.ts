import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ErrorComponent } from '../error/error.component';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.sass'],
})
export class RegisterComponent implements OnInit {
  username: string;
  password: string;
  email: string;
  type: string;
  registerForm: FormGroup;

  constructor(
    private httpClient: HttpClient,
    private dialogRef: MatDialogRef<RegisterComponent>,
    private dialogController: MatDialog,
    private router: Router,
    private fb: FormBuilder) {
      this.registerForm = fb.group({
        email: ['', [Validators.required]],
        username: ['', [Validators.required]],
        type: ['', [Validators.required]],
        password: ['', [Validators.required]]
      });
    }

  ngOnInit(): void {}

  register(): void {
    console.log("Register called with username: " + this.username + " password: " + this.password + "type: " + this.type + " email: " + this.email);
    const formData = new FormData();
    formData.append("username", this.username);
    formData.append("password", this.password);
    formData.append("type", this.type);
    formData.append("email", this.email);
    
    this.httpClient.post<any>(environment.BACKEND_IP + '/registration', formData).subscribe(
      (res) => {
        console.log(res);
        this.dialogController.open(ErrorComponent, {
          data: "Successfully registered"
        })
        this.dialogRef.close(); 
      },
      (err) => console.log(err)
    );
    
  }
}
