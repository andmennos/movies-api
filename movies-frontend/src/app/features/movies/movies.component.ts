import { Component, OnInit, ViewChild } from '@angular/core';
import { Movie, RequisicaoMovies, ResponseFilters, ResponseMovies } from './models/movie.model';
import { MatPaginator } from '@angular/material/paginator';
import { MoviesService } from './services/movies.service';
import { PageEvent } from './models/page-event.model';
import { FavoriteMoviesService } from '../favorite-movies/services/favorite-movies.service';

@Component({
  selector: 'app-movies',
  templateUrl: './movies.component.html',
  styleUrls: ['./movies.component.scss']
})
export class MoviesComponent implements OnInit {
  movies: Movie[] = [];
  generos: string[] = [];
  sortFields: { label: string; value: string }[] = [];
  sortOrders: string[] = [];
  loading: boolean = false;
  erro!: string;

  selectedGenre: string = '';
  selectedSortField: string = 'anoLancamento';
  selectedOrder: 'asc' | 'desc' = 'asc';
  pageIndex: number = 0;
  pageSize: number = 20;
  totalMovies: number = 0;

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(private moviesService: MoviesService, 
    private favoriteService: FavoriteMoviesService) { };

  ngOnInit(): void {
    this.loadFilters();
    this.loadMovies()
  }

  onPageChange(event: PageEvent) {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.loadMovies();
  }

  applyFilters() {
    this.pageIndex = 0;
    this.paginator.firstPage();
    this.loadMovies();
  }

  toggleFavorite(movie: Movie) {
    this.favoriteService.toggleFavorite(movie);
  }

  isFavorite(movie: Movie): boolean {
    return this.favoriteService.isFavorite(movie.id);
  }

  

  private loadFilters() {

    this.moviesService.getFilters().subscribe({
      next: (filters: ResponseFilters) => {
        const labels: { [key: string]: string } = {
          nome: 'Nome',
          anoLancamento: 'Ano de Lançamento',
          genero: 'Gênero'
        };

        this.generos = filters.availableGenres.sort();
        this.sortOrders = filters.sortOrders
        this.sortFields = filters.availableSortFields.map(field => ({
          label: labels[field] || field,
          value: field
        }))
      },
      error: () => {
        this.erro = 'Erro ao carregar filtros. Tente novamente.';
      }
    })
  }

  private loadMovies() {

    this.loading = true;
    const page = this.pageIndex + 1;

    const reqMovies: RequisicaoMovies = {
      page: page,
      limit: this.pageSize,
      sortBy: this.selectedSortField,
      order: this.selectedOrder,
      genero: this.selectedGenre
    }

    this.moviesService.getMovies(reqMovies).subscribe({
      next: (response: ResponseMovies) => {
        this.movies = response.data;
        this.totalMovies = response.pagination.totalMovies;
        this.loading = false;
      }, error: () => {
        this.erro = "Erro ao carregar filmes. Tente novamente.";
        this.loading = false
      }
    })
  }






}
