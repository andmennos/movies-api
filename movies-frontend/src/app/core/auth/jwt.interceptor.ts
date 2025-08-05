import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse
} from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
import { AuthService } from './auth.service';
import { Router } from '@angular/router';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {

  constructor(
    private readonly authService: AuthService,
    private readonly router: Router
  ) { }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token = this.authService.getToken();
    if (token) {
      const clone = request.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`
        }
      })

      return next.handle(clone).pipe(
        catchError((erro: HttpErrorResponse) => {
          if (erro.status === 401 || erro.status === 403) {
            this.authService.logout();
            this.router.navigate(['/login'])
          }
          return throwError(() => erro);
        })
      )
    }
    return next.handle(request)
  }
}
