import { Component, OnInit } from '@angular/core';
import { FavoriteMoviesService } from './services/favorite-movies.service';
import { Movie } from '../movies/models/movie.model';

@Component({
  selector: 'app-favorite-movies',
  templateUrl: './favorite-movies.component.html',
  styleUrls: ['./favorite-movies.component.scss']
})
export class FavoriteMoviesComponent implements OnInit {
  favoriteMovies: Movie[] = [];

  constructor(private favoriteService: FavoriteMoviesService){}
  
  
  ngOnInit(): void {
    this.loadFavorites();
  }

  private loadFavorites() {
    this.favoriteMovies = this.favoriteService.getFavorite();
  }

  removeFavorite(movie: Movie) {
    this.favoriteService.remove(movie.id);
    this.loadFavorites();
  }
}
