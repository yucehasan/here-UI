import { HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { AuthService } from './auth.service';
import { HttpService } from 'src/app/services/http.service';

@Injectable({
  providedIn: 'root'
})
export class FileService {
  token;

  constructor(
    private authService: AuthService,
    private httpService: HttpService) {
    this.authService.getToken().subscribe( (token) => {
      this.token = token;
    })
    }

  getSlide(): string {
    // var headers = new HttpHeaders();
    // headers.set(
    //   'Authorization',
    //   'Bearer ' + this.token
    // );
    // this.httpService.get(environment.BACKEND_IP + '/slide', headers).subscribe(
    //   (res) => {
    //     console.log(res);
    //   },
    //   (err) => {
    //     console.error("Error is -->", err);
    //   },
    //   () => {
    //     console.log("Completed")
    //   }
    // );
    // return "";
    return environment.pdf;
  }

  uploadSlide(courseID: string, b64: string): void {
    var headers = new HttpHeaders().set(
      'Authorization',
      'Bearer ' + this.token
    );
    var formData = new FormData();
    formData.append('course_id', courseID);
    formData.append('file', b64);
    var formData = new FormData();
    this.httpService.post(environment.BACKEND_IP + '/slide', formData, headers).subscribe(
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
    var headers = new HttpHeaders().set(      
      'Authorization',
      'Bearer ' + this.token
    );
    var formData = new FormData();
    formData.append('course_id', courseID);
    formData.append('file', b64);
    formData.append('date', new Date().toDateString())
    this.httpService.post(environment.BACKEND_IP + '/note', formData, headers).subscribe(
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

  fetchNotes(): void {
    var headers = new HttpHeaders();
    headers.set(
      'Authorization',
      'Bearer ' + this.token
    );
    this.httpService.get(environment.BACKEND_IP + '/note', headers).subscribe(
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
