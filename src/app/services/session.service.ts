import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class SessionService {
  constructor(private http: HttpClient) {}

  openSession(userType: string, courseID: string, token: string): void {
    if (userType == 'instructor') {
      var formData = new FormData();
      formData.append('course_id', courseID);
      var header = new HttpHeaders();
      header.set(      
        'Authorization',
        'Bearer ' + token
      );
      this.http.post(environment.BACKEND_IP + '/session', formData, {headers: header}).subscribe(
        (res) => {
          console.log(res);
        },
        (err) => {
          console.error("Error is -->", err);
        },
        () => {
          console.log("Completed")
        }
      );
    }
  }

  joinSession(courseID: string, token: string): boolean {
    var formData = new FormData();
    formData.append('course_id', courseID);
    var header = new HttpHeaders();
    header.set(      
      'Authorization',
      'Bearer ' + token
    );
    this.http.post(environment.BACKEND_IP + '/join', formData, {headers: header}).subscribe(
      (res) => {
        console.log(res);
      },
      (err) => {
        console.error("Error is -->", err);
      },
      () => {
        console.log("Completed")
      }
    )
    return false;
  }

  endSession(userType: string, courseID: string, token: string): void {
    if (userType == 'instructor') {
      var formData = new FormData();
      this.http.post(environment.BACKEND_IP + '/session', formData);
    }
  }
}
