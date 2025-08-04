import { Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { RequestAuth, ResponseAuth } from './auth.model';
import { ApiService } from '../api/api.service';

@Injectable()

export class AuthService {
  private readonly TOKEN_ACCESS = 'access_token';

  constructor(private apiService: ApiService) { }

  autenticar(login: RequestAuth): Observable<ResponseAuth> {
    return this.apiService.autenticarLogin(login).pipe(
      tap(response => this.setToken(response.token))
    );
  }

  private setToken(token:string) {
    sessionStorage.setItem(this.TOKEN_ACCESS, token);    
  }

  getToken() {
    return sessionStorage.getItem(this.TOKEN_ACCESS)
  }

  isLogged() {
    const token = this.getToken();
    return !!this.getToken();
  }

  logout() {
    sessionStorage.removeItem(this.TOKEN_ACCESS);
  }

}
