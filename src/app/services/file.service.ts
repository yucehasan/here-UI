import { HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { AuthService } from './auth.service';
import { HttpService } from 'src/app/services/http.service';
import { MatDialog } from '@angular/material/dialog';
import { ErrorComponent } from '../components/error/error.component';

@Injectable({
  providedIn: 'root'
})
export class FileService {
  token;

  constructor(
    private dialogController: MatDialog,
    private authService: AuthService,
    private httpService: HttpService) {
    this.authService.getToken().subscribe( (token) => {
      this.token = token;
    })
    }

  getSlide(courseID: string): Promise<string> {
    return new Promise<string>( (resolve, reject) => {
      var headers = new HttpHeaders();
      headers.set(
        'Authorization',
        'Bearer ' + this.token
      );
      this.httpService.get(environment.BACKEND_IP + '/file?course_id=' + courseID, headers).subscribe(
        (res) => {
          resolve(res["file"])
        },
        (err) => {
          reject(err);
        }
      );
    })

  }

  uploadSlide(courseID: string, b64: string): void {
    var headers = new HttpHeaders().set(
      'Authorization',
      'Bearer ' + this.token
    );
    var formData = new FormData();
    formData.append('course_id', courseID);
    formData.append('file', b64);
    this.httpService.post(environment.BACKEND_IP + '/file', formData, headers).subscribe(
      (res) => {
        console.log(res);
        this.dialogController.open(ErrorComponent, {
          data: "File successfully uploaded"
        })
      },
      (err) => {
        console.error("Error is -->", err);
        this.dialogController.open(ErrorComponent, {
          data: "An error occurred. Please try again"
        })
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
