import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { RequestAuth, ResponseAuth } from '../auth/auth.model';
import { Observable } from 'rxjs';
import { environment } from 'src/environments.ts/environment';
import { RequisicaoMovies, ResponseFilters, ResponseMovies } from 'src/app/features/movies/models/movie.model';

@Injectable()

export class ApiService {

  private readonly baseUrl = environment.baseUrl;

  constructor(private readonly httpClient: HttpClient) { }

  autenticarLogin(login: RequestAuth): Observable<ResponseAuth> {
    const url = `${this.baseUrl}/auth/login`;
    return this.httpClient.post<ResponseAuth>(url, login);
  }

  getMovies(reqMovies: RequisicaoMovies): Observable<ResponseMovies> {
    const params = new HttpParams() 
    .set('page', reqMovies.page.toString())
    .set('limit', reqMovies.limit.toString())
    .set('sortBy', reqMovies.sortBy)
    .set('order', reqMovies.order)
    .set('genero', reqMovies.genero)

    const url = `${this.baseUrl}/movies`;
    return this.httpClient.get<ResponseMovies>(url, {params});
  }

  getFilters(): Observable<ResponseFilters> {
    const url = `${this.baseUrl}/movies/filters`;
    
    return this.httpClient.get<ResponseFilters>(url);
  }
}
