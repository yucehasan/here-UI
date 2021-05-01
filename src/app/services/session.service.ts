import { HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { AuthService } from './auth.service';
import { HttpService } from 'src/app/services/http.service';

@Injectable({
  providedIn: 'root',
})
export class SessionService {
  token;

  constructor(private authService: AuthService,
    private httpService: HttpService) {
  }

  openSession(courseID: string, token: string): boolean {
    var formData = new FormData();
    formData.append('course_id', courseID);
    var headers = new HttpHeaders().set(      
      'Authorization',
      'Bearer ' + token
    );
    this.httpService.post(environment.BACKEND_IP + '/session', formData, headers).subscribe(
      (res) => {
        console.log(res);
        return true;
      },
      (err) => {
        console.error("Error is -->", err);
        return false;
      }
    );
    return false;
  }

  joinSession(courseID: string, token): boolean {
    var formData = new FormData();
    formData.append('course_id', courseID);
    var headers = new HttpHeaders().set(      
      'Authorization',
      'Bearer ' + token
    );
    this.httpService.post(environment.BACKEND_IP + '/session/join', formData, headers).subscribe(
      (res) => {
        console.log(res);
        return true;
      },
      (err) => {
        console.error("Error is -->", err);
        return false;
      }
    );
    return false;
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
