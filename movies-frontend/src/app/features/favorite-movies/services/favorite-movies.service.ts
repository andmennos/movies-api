import { Injectable } from '@angular/core';
import { Movie } from '../../movies/models/movie.model';

@Injectable({
  providedIn: 'root'
})
export class FavoriteMoviesService {
  private favoriteMoviesId: Set<number> = new Set();
  private movieMap: Map<number, Movie> = new Map();

  toggleFavorite(movie: Movie) {
    if(this.favoriteMoviesId.has(movie.id)) {
      this.favoriteMoviesId.delete(movie.id);
      this.movieMap.delete(movie.id);
    } else {
      this.favoriteMoviesId.add(movie.id);
      this.movieMap.set(movie.id, movie);
    }
  }

  isFavorite(movieId: number): boolean {
    return this.favoriteMoviesId.has(movieId);
  }

  getFavorite(): Movie[] {
    return Array.from(this.movieMap.values())
  }

  remove(movieId: number) {
    this.favoriteMoviesId.delete(movieId);
    this.movieMap.delete(movieId);
  }

  clear() {
    this.favoriteMoviesId.clear();
    this.movieMap.clear();
  }

  constructor() { }
}
