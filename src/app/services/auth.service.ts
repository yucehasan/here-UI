import { Injectable } from '@angular/core';
import { Observable, of, BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  token: string = "";
  username: string = "";
  userType: string = "";

  // private tokenSub = new BehaviorSubject<string>(this.token);
  // private usernameSub = new BehaviorSubject<string>(this.username);
  // private userTypeSub = new BehaviorSubject<string>(this.userType);

  private tokenSub = new BehaviorSubject<string>(localStorage.getItem('token'));
  private usernameSub = new BehaviorSubject<string>(localStorage.getItem('username'));
  private userTypeSub = new BehaviorSubject<string>(localStorage.getItem('userType'));


  currentToken = this.tokenSub.asObservable();
  currentUsername = this.usernameSub.asObservable();
  currentUserType = this.userTypeSub.asObservable();
  
  updateToken(newToken: string): void {
    this.token = newToken;
    this.tokenSub.next(newToken);
    localStorage.setItem("token", newToken);
    console.log("Token is updated. New Token: \n" + newToken);
  }

  updateUsername(newUsername: string): void {
    this.username = newUsername;
    this.usernameSub.next(newUsername);
    localStorage.setItem("username", newUsername);
    console.log("Username is updated. New Username: \n" + newUsername);
  }

  updateUserType(newUserType: string): void {
    this.userType = newUserType;
    this.userTypeSub.next(newUserType);
    localStorage.setItem("userType", newUserType);
    console.log("User type is updated. New User type: \n" + newUserType);
  }

  getToken(): Observable<string> {
    return this.currentToken;
  }

  getUsername(): Observable<string> {
    return this.currentUsername;
  }

  getUserType(): Observable<string> {
    return this.currentUserType;
  }

}
