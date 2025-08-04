import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { RequisicaoMovies, ResponseFilters, ResponseMovies } from '../models/movie.model';
import { ApiService } from 'src/app/core/api/api.service';

@Injectable({
  providedIn: 'root'
})
export class MoviesService {
  
  constructor(private apiServicec: ApiService) { }

  getMovies(reqMovies: RequisicaoMovies): Observable<ResponseMovies> {
    return this.apiServicec.getMovies(reqMovies);
  }

  getFilters(): Observable<ResponseFilters> {
    return this.apiServicec.getFilters();
  }
}
