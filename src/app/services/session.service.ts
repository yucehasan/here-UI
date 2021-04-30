import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class SessionService {
  token;

  constructor(private http: HttpClient, private authService: AuthService) {
  }

  openSession(courseID: string, token: string): boolean {
    var formData = new FormData();
    formData.append('course_id', courseID);
    var header = new HttpHeaders().set(      
      'Authorization',
      'Bearer ' + token
    );
    this.http.post(environment.BACKEND_IP + '/session', formData, {headers: header}).subscribe(
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
    var header = new HttpHeaders().set(      
      'Authorization',
      'Bearer ' + token
    );
    this.http.post(environment.BACKEND_IP + '/session/join', formData, {headers: header}).subscribe(
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
      var header = new HttpHeaders();
      header.set(      
        'Authorization',
        'Bearer ' + this.authService.currentToken
      );
      this.http.post(environment.BACKEND_IP + '/session', formData);
    }
  }
}
