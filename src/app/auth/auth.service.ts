import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthModel } from '../models/auth';
import { Observable, Subject } from 'rxjs';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';

const API_URL = environment.apiUrl + '/users/'

@Injectable({
  providedIn: 'root'
})
export class AuthService {
 private token: string = '';
 private userId: string = '';
 private tokenTimer: any;
 private isUserAuthenticated: boolean = false;
 private authListenerSub = new Subject<boolean>();
  constructor(private http: HttpClient, private router: Router) { }

  public getToken(): string {
    return this.token;
  }

  public getIsAuth(): boolean {
    return this.isUserAuthenticated;
  }

  public getAuthListenerSub():  Observable<boolean> {
    return this.authListenerSub.asObservable();
  }
  public createUser(email: string, password: string) {
    const auth: AuthModel = {
      email: email,
      password: password
    }
    this.http.post(API_URL + 'signup', auth)
      .subscribe({
        next: () => {
          this.router.navigate(['/'])
        },
        error: (err) => {
          console.log(err)
          this.authListenerSub.next(false)
        }
      })
  }

  public login(email: string, password: string) {
    const auth: AuthModel = {email: email, password: password};
    this.http.post<{token: string, expiresIn: number, userId: string}>(API_URL + 'login', auth).subscribe({

      next: (res) => {   
        const token = res.token;
        const expiresIn = res.expiresIn;
        this.setTimer(res.expiresIn);
        if(token){
          this.userId = res.userId;
          this.isUserAuthenticated = true;
          this.authListenerSub.next(true);
          const now = new Date();
          const expirationDate = new Date(now.getTime() + expiresIn * 1000);
          this.saveAuthToken( token, expirationDate, this.userId);
          this.router.navigate(['/']);
        }
      },
      error: (err) => {
        this.authListenerSub.next(false)
      }
    })
  }

  public logout() {
    this.token = '';
    this.userId = '';
    clearTimeout(this.tokenTimer);
    this.isUserAuthenticated = false;
    this.authListenerSub.next(false);
    this.clearAuthToken();
    this.router.navigate(['/']);
  }

  public getUserId(): string {
    return this.userId;
  }

  public autoAuthUser() {
    const autoAuthInfo = this.getAutoAuth();
    const now = new Date();
    if (autoAuthInfo?.expirationDate) {
      const expiresIn = autoAuthInfo.expirationDate.getTime() - now.getTime()
      if (expiresIn > 0) {
        this.token = (autoAuthInfo.token) ? autoAuthInfo.token : '';
        this.userId = (autoAuthInfo.userId) ? autoAuthInfo.userId : '';
        this.isUserAuthenticated = true;
        this.setTimer(expiresIn / 1000);
        this.authListenerSub.next(true);
      }
    }
  }

  private saveAuthToken(token: string, expirationDate: Date, userId: string) {
    localStorage.setItem("token", token);
    localStorage.setItem("expire", expirationDate.toISOString());
    localStorage.setItem("userId", userId)
  }

  private clearAuthToken() {
    localStorage.removeItem("token");
    localStorage.removeItem("expire");
    localStorage.removeItem("userId");
  }

  private getAutoAuth() {
    const token = localStorage.getItem("token");
    const expire = localStorage.getItem("expire");
    const userId = localStorage.getItem("userId");

    if (!token && !expire) {
      return;
    }

    const obj = {
      token: token,
      expirationDate: expire ? new Date(expire) : new Date(),
      userId: userId
    }

    return obj;
  }

  private setTimer(duration: number) {
    setTimeout(() => {
      this.logout();
      this.router.navigate(['/auth/login']);
    }, duration * 1000);
  }
}
