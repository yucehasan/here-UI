import { Injectable } from '@angular/core';
import { Observable, of, BehaviorSubject } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private httpClient: HttpClient) { }

  private tokenSub = new BehaviorSubject<string>(localStorage.getItem('token'));
  private refreshTokenSub = new BehaviorSubject<string>(localStorage.getItem('refresh_token'));
  private usernameSub = new BehaviorSubject<string>(localStorage.getItem('username'));
  private userTypeSub = new BehaviorSubject<string>(localStorage.getItem('userType'));

  token: string = "";
  refreshToken: string = "";

  currentToken = this.tokenSub.asObservable();
  currentRefreshToken = this.refreshTokenSub.asObservable();
  currentUsername = this.usernameSub.asObservable();
  currentUserType = this.userTypeSub.asObservable();

  updateToken(newToken: string): void {
    this.tokenSub.next(newToken);
    this.token = newToken;
    localStorage.setItem("token", newToken);
  }

  updateRefreshToken(newRefreshToken: string): void {
    this.refreshTokenSub.next(newRefreshToken);
    this.refreshToken = newRefreshToken;
    localStorage.setItem("refresh_token", newRefreshToken);
  }

  updateUsername(newUsername: string): void {
    this.usernameSub.next(newUsername);
    localStorage.setItem("username", newUsername);
  }

  updateUserType(newUserType: string): void {
    this.userTypeSub.next(newUserType);
    localStorage.setItem("userType", newUserType);
  }

  refreshAccessToken(): Promise<string> {
    return new Promise( (resolve, reject) => {

      const headers = new HttpHeaders().set(
        'Authorization',
        'Bearer ' + localStorage.getItem('refresh_token')
        );
        this.httpClient.post<any>(environment.BACKEND_IP + "/token/refresh", {}, {headers: headers})
        .subscribe((res) => {
          this.updateToken(res.access_token);
          resolve(this.token);
        },
        (err) => {
          console.log(err);
          reject("Sıkıntı oldu");
        })
      }
    )
  }

  getToken(): Observable<string> {
    return this.currentToken;
  }

  getRefreshToken(): Observable<string> {
    return this.currentRefreshToken;
  }

  getUsername(): Observable<string> {
    return this.currentUsername;
  }

  getUserType(): Observable<string> {
    return this.currentUserType;
  }

}
