import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  authData: Object = {"token": "", "username": ""};

  token: string;
  username: string;

  updateToken(newToken: string): void {
    this.authData["token"] = newToken;
    this.token = newToken; 
    console.log("Token is updated. New Token: \n" + newToken);
  }

  updateUsername(newUsername: string): void {
    this.authData["username"] = newUsername;
    this.username = newUsername;
    console.log("Username is updated. New Username: \n" + newUsername);
  }

  getToken(): string {
    return this.token;
  }




}
