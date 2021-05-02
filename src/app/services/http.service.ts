import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class HttpService {
  token: string;
  constructor(
    private httpClient: HttpClient,
    private authService: AuthService
  ) {
    this.authService.getToken().subscribe((token) => {
      this.token = token;
    })
  }

  get(url: string, headers?: HttpHeaders): Observable<any> {
    const result = new Observable<any>((observer) => {
      this.httpClient.get<any>(url, { headers: headers }).subscribe(
        (res) => {
          observer.next(res);
        },
        (err) => {
          this.authService.refreshAccessToken().then((token) => {
            const headers = new HttpHeaders().set(
              'Authorization',
              'Bearer ' + this.token
            );
            this.httpClient.get<any>(url, {headers: headers})
            .subscribe( (res) => {
              observer.next(res);
            })
          }).catch( (err) => {
            console.log(err);
          })
        }
      )
    })

    return result;
  }

  post(url: string, body:any ,headers?: HttpHeaders): Observable<any> {
    const result = new Observable<any>((observer) => {
      this.httpClient.post<any>(url, body, { headers: headers }).subscribe(
        (res) => {
          observer.next(res);
        },
        (err) => {
          this.authService.refreshAccessToken().then((token) => {
            const headers = new HttpHeaders().set(
              'Authorization',
              'Bearer ' + this.token
            );
            this.httpClient.post<any>(url, body, {headers: headers})
            .subscribe( (res) => {
              observer.next(res);
              },
              (err) => {
                observer.next(err);
              })
          }).catch( (err) => {
            console.log(err);
          })
        }
      )
    })

    return result;
  }

}
