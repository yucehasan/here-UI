import { Component, OnInit } from '@angular/core';
import { throwMatDialogContentAlreadyAttachedError, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpHeaders } from '@angular/common/http';
import { AuthService } from '../../services/auth.service';
import { environment } from 'src/environments/environment';
import { HttpService } from 'src/app/services/http.service';

@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.component.html',
  styleUrls: ['./edit-profile.component.sass'],
})
export class EditProfileComponent implements OnInit {
  username: string;
  oldPassword: string;
  newPassword: string;
  newPasswordAgain: string;
  token: string;
  editProfileForm: FormGroup;
  constructor(
    private router: Router,
    public dialogRef: MatDialogRef<EditProfileComponent>,
    private formBuilder: FormBuilder,
    private httpService: HttpService,
    private authService: AuthService,
    private fb: FormBuilder) {
      this.editProfileForm = fb.group({
        username: [this.username],
        oldPassword: [''],
        newPassword: [''],
        newPasswordAgain: ['']
      });
    }
  ngOnInit(): void { 
    this.authService.getToken().subscribe((token) => {
      this.token = token;
    });
    this.authService.getUsername().subscribe((username) => {
      this.username = username;
    });
  }

  editProfile(): void {
    if (this.newPassword == this.newPasswordAgain){
      const headers = new HttpHeaders().set(
        'Authorization',
        'Bearer ' + this.token
      );
      
      const formData = new FormData();
      formData.append("username", this.username);
      formData.append("old_password", this.oldPassword);
      formData.append("new_password", this.newPassword);
  
      this.httpService.post(environment.BACKEND_IP + "/editProfile", formData, headers ).subscribe(
        (res) => {
          console.log(res)
          this.authService.updateUsername(res["username"]);
          this.dialogRef.close();
        }
      );
    }
    else{
      alert('Passwords do not match.');
    }
  }
}

