import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class HttpService {
  token: string;
  constructor(private httpClient: HttpClient,
    private authService: AuthService) { 
      this.authService.getToken().subscribe(token => {
        this.token = token;
        console.log("Token is updated: ", this.token.substr(5,10));
      })
    }

  get(url: string, headers?: HttpHeaders): any {
    // var response: any; // : { [key: string]: string; }


    var promise =
      this.httpClient.get(url, { headers: headers }).toPromise();
    promise.then((result) => {
      console.log("Result: ", result);
      return result;
    },
      (err) => {
        console.log("Err: ", err);
        if (err.status === 401) {
          console.log("401")
          this.authService.refreshAccessToken();
          console.log("Token Refreshed");
          const headers = new HttpHeaders().set(
            'Authorization',
            'Bearer ' + this.token
          );
          console.log(this.token);
          var innerPromise = 
          this.httpClient.get<any>(url, { headers: headers}).toPromise();
          
          innerPromise.then( (result) => {
            console.log("Inner result: ", result);
            return result;
          })
          
          // .subscribe((res) => {
          //   return res;
          // },
          // (err) => {
          //   console.log("Inner Error: ", err);
          // })
        }
      })
    return promise;
  }
}
