import { Component, OnDestroy, OnInit } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent implements OnInit, OnDestroy {
  
  public isUserAuthenticated: boolean = false;
  private subscription: Subscription | undefined;
  constructor(private authService: AuthService) {}
  ngOnInit(): void {
    this.isUserAuthenticated = this.authService.getIsAuth()
    this.subscription = this.authService.getAuthListenerSub().subscribe( val => {
      this.isUserAuthenticated = val;
    })
  }

  public onLogout() {
    this.authService.logout();
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }

}
