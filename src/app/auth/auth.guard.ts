import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from './auth.service';
import { Observable } from 'rxjs';

export const authGuard: CanActivateFn = (route, state): boolean | Observable<boolean> | Promise<boolean> => {
  const authService = inject(AuthService);
  const router: Router = inject(Router);
  const result = authService.getIsAuth();

  if (!result) {
    router.navigate(['/']);
    return result;
  }
    return result
};
