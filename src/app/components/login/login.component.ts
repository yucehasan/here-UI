import { Component, OnInit } from '@angular/core';
import { throwMatDialogContentAlreadyAttachedError, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../services/auth.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.sass'],
})
export class LoginComponent implements OnInit {
  email: string;
  password: string;
  loginForm: FormGroup;
  constructor(
    private router: Router,
    public dialogRef: MatDialogRef<LoginComponent>,
    private formBuilder: FormBuilder,
    private httpClient: HttpClient,
    private authService: AuthService,
    private fb: FormBuilder) {
    this.loginForm = fb.group({
      email: ['', [Validators.required]],
      password: ['', [Validators.required]]
    });
  }
  ngOnInit(): void { }

  login(): void {
    console.log(
      'Login called with email: ' +
      this.email +
      ' password: ' +
      this.password
    );
    const formData = new FormData();
    formData.append("email", this.email);
    formData.append("password", this.password);

    this.httpClient.post<any>(environment.BACKEND_IP + "/login", formData).subscribe(
      (res) => {
        if (res['access_token'] !== undefined) {
          this.authService.updateToken(res['access_token']);
          this.authService.updateRefreshToken(res['refresh_token']);
          this.authService.updateUsername(res["message"].substr(13));
          this.authService.updateUserType(res["type"]);
          this.router.navigate(['main']);
          this.dialogRef.close();
        }
        else {
          console.log(res);
          console.log("Failed");
          alert(res["message"]);
        }
      }
    );
  }
}
