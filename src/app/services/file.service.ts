import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class FileService {

  constructor(private http: HttpClient, private authService: AuthService) {}

  getSlide(): string{    
    var header = new HttpHeaders();
    header.set(      
      'Authorization',
      'Bearer ' + this.authService.currentToken
    );
    this.http.get(environment.BACKEND_IP + '/slide', {headers: header}).subscribe(
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
    return "";
  }

  uploadSlide(courseID: string, b64: string): void{      
    var header = new HttpHeaders();
    header.set(      
      'Authorization',
      'Bearer ' + this.authService.currentToken
    );
    var formData = new FormData();
    formData.append('course_id', courseID);
    formData.append('file', b64);
    var formData = new FormData();
    this.http.post(environment.BACKEND_IP + '/slide', formData, {headers: header}).subscribe(
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

  uploadNote(courseID: string, b64: string): void{      
    var header = new HttpHeaders();
    header.set(      
      'Authorization',
      'Bearer ' + this.authService.currentToken
    );
    var formData = new FormData();
    formData.append('course_id', courseID);
    formData.append('file', b64);
    this.http.post(environment.BACKEND_IP + '/note', formData, {headers: header}).subscribe(
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

  fetchNotes(): void{
    var header = new HttpHeaders();
    header.set(      
      'Authorization',
      'Bearer ' + this.authService.currentToken
    );
    this.http.get(environment.BACKEND_IP + '/note', {headers: header}).subscribe(
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
