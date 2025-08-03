import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { RequestAuth, ResponseAuth } from '../auth/auth.model';
import { Observable } from 'rxjs';
import { environment } from 'src/environments.ts/environment';

export class ApiService {

  private readonly baseUrl = environment.baseUrl;

  constructor(private httpClient: HttpClient) { }

  autenticarLogin(login: RequestAuth): Observable<ResponseAuth> {
    const url = `${this.baseUrl}/auth/login`;
    return this.httpClient.post<ResponseAuth>(url, login);
  }
}
