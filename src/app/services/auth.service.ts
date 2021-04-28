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
    console.log("AUTH SERVICE: Token is updated. New Token: \n" + newToken.substr(0, 5) + "...");
  }

  updateRefreshToken(newRefreshToken: string): void {
    this.refreshTokenSub.next(newRefreshToken);
    this.refreshToken = newRefreshToken;
    localStorage.setItem("refresh_token", newRefreshToken);
    console.log("AUTH SERVICE: Refresh token is updated. New Token: \n" + newRefreshToken.substr(0, 5) + "...");
  }

  updateUsername(newUsername: string): void {
    this.usernameSub.next(newUsername);
    localStorage.setItem("username", newUsername);
    console.log("AUTH SERVICE: Username is updated. New Username: \n" + newUsername);
  }

  updateUserType(newUserType: string): void {
    this.userTypeSub.next(newUserType);
    localStorage.setItem("userType", newUserType);
    console.log("AUTH SERVICE: User type is updated. New User type: \n" + newUserType);
  }

  refreshAccessToken(): void {
    const headers = new HttpHeaders().set(
      'Authorization',
      'Bearer ' + this.refreshToken
    );

    this.httpClient.post<any>(environment.BACKEND_IP + "/token/refresh", {headers: headers})
    .subscribe((res) => {
      console.log("AUTH SERVICE: response for token refresh: " + res);
      this.updateToken(res.access_token);
    })

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
