import { HttpErrorResponse, HttpHandler, HttpInterceptor, HttpInterceptorFn, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { catchError, throwError } from 'rxjs';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {

  constructor(private snackBar: MatSnackBar) {}
  intercept(req: HttpRequest<any>, next: HttpHandler) {
    return next.handle(req).pipe(
      catchError((error: HttpErrorResponse) => {

        this.snackBar.open(error.error.message, '' ,{
          duration: 3000,
          horizontalPosition: 'center',
          verticalPosition: 'top'
        })
        return throwError(() => new Error());
      })
    );
  };
}
