import { Injectable } from '@angular/core';
import { Observable, of, BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private tokenSub = new BehaviorSubject<string>(localStorage.getItem('token'));
  private refreshTokenSub = new BehaviorSubject<string>(localStorage.getItem('refresh_token'));
  private usernameSub = new BehaviorSubject<string>(localStorage.getItem('username'));
  private userTypeSub = new BehaviorSubject<string>(localStorage.getItem('userType'));

  currentToken = this.tokenSub.asObservable();
  currentRefreshToken = this.refreshTokenSub.asObservable();
  currentUsername = this.usernameSub.asObservable();
  currentUserType = this.userTypeSub.asObservable();

  updateToken(newToken: string): void {
    this.tokenSub.next(newToken);
    localStorage.setItem("token", newToken);
    console.log("Token is updated. New Token: \n" + newToken);
  }

  updateRefreshToken(newRefreshToken: string): void {
    this.refreshTokenSub.next(newRefreshToken);
    localStorage.setItem("refresh_token", newRefreshToken);
    console.log("Refresh token is updated. New Token: \n" + newRefreshToken);
  }

  updateUsername(newUsername: string): void {
    this.usernameSub.next(newUsername);
    localStorage.setItem("username", newUsername);
    console.log("Username is updated. New Username: \n" + newUsername);
  }

  updateUserType(newUserType: string): void {
    this.userTypeSub.next(newUserType);
    localStorage.setItem("userType", newUserType);
    console.log("User type is updated. New User type: \n" + newUserType);
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
