import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class NotesService {

  notes;
  noteSub = new Subject<any>();

  constructor(private httpClient: HttpClient, private authService: AuthService) {
    this.notes = []
  }

  // getEmptySchedule(): void{
  //   return EMPTYDATA;
  // }

  fetchNotes(token): void {
    var header = new HttpHeaders().set(      
      'Authorization',
      'Bearer ' + token
    );
    this.httpClient.get<any>(environment.BACKEND_IP + "/note", {headers: header}).subscribe((res) => {
      console.log(res)
      this.notes = res;
      this.noteSub.next(res);
    },
    (err) => {
      console.log("Got an error", err)
      // this.authService.refreshAccessToken().then( (token) => {
      //   console.log("new token:", token)
      //   const headers = new HttpHeaders().set(
      //     'Authorization',
      //     'Bearer ' + token
      //   );
      //   this.httpClient.get<any>(environment.BACKEND_IP + '/course', { headers: headers }).subscribe(
      //     (res) => {
      //       console.log(res);
      //       this.updateSchedule(res)
      //     })
      // }).catch( (err) => {
      //   console.log(err);
      // });
    }
    );
  }

  fetchANote(note_id, token): Promise<string> {
    return new Promise<string>( (resolve, reject) => {
      var header = new HttpHeaders().set(      
        'Authorization',
        'Bearer ' + token
        );
      this.httpClient.get(environment.BACKEND_IP + '/note/' + note_id, {headers: header}).subscribe(
        (res) => {
          resolve(res as string);
        },
        (err) => {reject(err)}
        );
    });
  }

  getNotes(): Observable<any> {
    return this.noteSub.asObservable();
  }
}
