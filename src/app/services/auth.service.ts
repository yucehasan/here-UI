import { Injectable } from '@angular/core';
import { Observable, of, BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  authData: Object = { "token": "", "username": "" };

  token: string = "";
  username: string = "";

  private tokenSub = new BehaviorSubject<string>(this.token);
  private usernameSub = new BehaviorSubject<string>(this.username);

  currentToken = this.tokenSub.asObservable();
  currentUsername = this.usernameSub.asObservable();

  updateToken(newToken: string): void {
    this.authData["token"] = newToken;
    this.token = newToken;
    this.tokenSub.next(newToken);
    console.log("Token is updated. New Token: \n" + newToken);
  }

  updateUsername(newUsername: string): void {
    this.authData["username"] = newUsername;
    this.username = newUsername;
    this.usernameSub.next(newUsername);
    console.log("Username is updated. New Username: \n" + newUsername);
  }

  getToken(): Observable<string> {
    return this.currentToken;
  }

  getUsername(): Observable<string> {
    return this.currentUsername;
  }

}
