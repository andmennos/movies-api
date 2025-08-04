import { Injectable } from '@angular/core';
import { Observable, of, tap } from 'rxjs';
import { RequisicaoMovies, ResponseFilters, ResponseMovies } from '../models/movie.model';
import { ApiService } from 'src/app/core/api/api.service';

@Injectable({
  providedIn: 'root'
})
export class MoviesService {
  cashFilters!: ResponseFilters;
  
  constructor(private apiServicec: ApiService) { }

  getMovies(reqMovies: RequisicaoMovies): Observable<ResponseMovies> {
    return this.apiServicec.getMovies(reqMovies);
  }

  getFilters(): Observable<ResponseFilters> {
    if(this.cashFilters) {
      return of(this.cashFilters);
    }
    
    return this.apiServicec.getFilters().pipe(
      tap(filters => this.cashFilters = filters)
    );
  }
}
