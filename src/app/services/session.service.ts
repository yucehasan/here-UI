import { HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { ErrorComponent } from '../components/error/error.component';
import { AuthService } from './auth.service';
import { HttpService } from 'src/app/services/http.service';

@Injectable({
  providedIn: 'root',
})
export class SessionService {
  token;

  constructor(private authService: AuthService,
    private router: Router, private dialogController: MatDialog, private httpService: HttpService) {
  }

  openSession(courseID: string, token: string) {
    console.log("trying to open course", courseID)
    var formData = new FormData();
    formData.append('course_id', courseID);
    var headers = new HttpHeaders().set(      
      'Authorization',
      'Bearer ' + token
    );
    this.httpService.post(environment.BACKEND_IP + '/session', formData, headers).subscribe(
      (res) => {
        console.log(res);
        this.router.navigate(['conference', res["id"], courseID])
      },
      (err) => {
        console.error("Error is -->", err);
      }
    );
  }

  joinSession(courseID: string, token): void {
    console.log("trying to join course", courseID)
    var formData = new FormData();
    formData.append('course_id', courseID);
    var headers = new HttpHeaders().set(      
      'Authorization',
      'Bearer ' + token
    );
    this.httpService.post(environment.BACKEND_IP + '/session/join', formData, headers).subscribe(
      (res) => {
        console.log(res);
        this.router.navigate(['conference', res["session_id"], courseID])
      },
      (err) => {
        this.dialogController.open(ErrorComponent, {
          data: err.error.error
        })
        console.log(err);
      },
      () => {console.log("completed")}
    );
  }

  getCurrentSessionId(): string {

    return "";
  }

  endSession(userType: string, courseID: string): void {
    if (userType == 'instructor') {
      var formData = new FormData();
      var headers = new HttpHeaders();
      headers.set(      
        'Authorization',
        'Bearer ' + this.authService.currentToken
      );
      this.httpService.post(environment.BACKEND_IP + '/session', formData);
    }
  }
}
