import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { MoviesComponent } from './movies.component';
import { MoviesService } from './services/movies.service';
import { FavoriteMoviesService } from '../favorite-movies/services/favorite-movies.service';
import { of, throwError } from 'rxjs';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Movie, ResponseFilters, ResponseMovies } from './models/movie.model';

describe('MoviesComponent', () => {
  let component: MoviesComponent;
  let fixture: ComponentFixture<MoviesComponent>;
  let moviesServiceSpy: jasmine.SpyObj<MoviesService>;
  let favoriteServiceSpy: jasmine.SpyObj<FavoriteMoviesService>;

  beforeEach(async () => {
    const moviesSpy = jasmine.createSpyObj('MoviesService', ['getFilters', 'getMovies']);
    const favoriteSpy = jasmine.createSpyObj('FavoriteMoviesService', ['toggleFavorite', 'isFavorite']);

    await TestBed.configureTestingModule({
      declarations: [MoviesComponent],
      imports: [
        MatPaginatorModule,
        MatSelectModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
        BrowserAnimationsModule
      ],
      providers: [
        { provide: MoviesService, useValue: moviesSpy },
        { provide: FavoriteMoviesService, useValue: favoriteSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(MoviesComponent);
    component = fixture.componentInstance;
    moviesServiceSpy = TestBed.inject(MoviesService) as jasmine.SpyObj<MoviesService>;
    favoriteServiceSpy = TestBed.inject(FavoriteMoviesService) as jasmine.SpyObj<FavoriteMoviesService>;

    component.paginator = {
      firstPage: jasmine.createSpy('firstPage')
    } as any;

    component.erro = '';
  });

  it('deve criar o componente', () => {
    expect(component).toBeTruthy();
  });

  it('deve carregar filtros e filmes no ngOnInit', fakeAsync(() => {
    const filtersMock: ResponseFilters = {
      availableGenres: ['Drama', 'Comédia'],
      availableSortFields: ['nome', 'anoLancamento', 'genero'],
      sortOrders: ['asc', 'desc']
    };
    const moviesMock: ResponseMovies = {
      data: [{ id: 1, nome: 'Filme 1', anoLancamento: 2000, descricao: 'desc', genero: 'Drama' }],
      pagination: { currentPage: 1, totalPages: 1, totalMovies: 1, moviesPerPage: 20, hasNextPage: false, hasPrevPage: false },
      filters: { sortBy: 'nome', order: 'asc', genero: '' }
    };

    moviesServiceSpy.getFilters.and.returnValue(of(filtersMock));
    moviesServiceSpy.getMovies.and.returnValue(of(moviesMock));

    component.ngOnInit();
    tick();

    expect(moviesServiceSpy.getFilters).toHaveBeenCalled();
    expect(component.generos).toEqual(['Comédia', 'Drama']);
    expect(component.sortOrders).toEqual(['asc', 'desc']);
    expect(component.sortFields.length).toBe(3);
    expect(moviesServiceSpy.getMovies).toHaveBeenCalled();
    expect(component.movies.length).toBe(1);
    expect(component.totalMovies).toBe(1);
    expect(component.loading).toBeFalse();
    expect(component.erro).toBe('');
  }));

  it('deve atualizar página e carregar filmes ao mudar página', () => {
    const pageEvent = { pageIndex: 2, pageSize: 30, length: 100 };
    moviesServiceSpy.getMovies.and.returnValue(of({
      data: [],
      pagination: { currentPage: 3, totalPages: 4, totalMovies: 100, moviesPerPage: 30, hasNextPage: true, hasPrevPage: true },
      filters: { sortBy: '', order: 'asc', genero: '' }
    }));

    component.onPageChange(pageEvent);

    expect(component.pageIndex).toBe(2);
    expect(component.pageSize).toBe(30);
    expect(moviesServiceSpy.getMovies).toHaveBeenCalled();
  });

  it('applyFilters deve resetar página e chamar firstPage do paginator', () => {
    moviesServiceSpy.getMovies.and.returnValue(of({
      data: [],
      pagination: { currentPage: 1, totalPages: 1, totalMovies: 0, moviesPerPage: 20, hasNextPage: false, hasPrevPage: false },
      filters: { sortBy: '', order: 'asc', genero: '' }
    }));

    component.pageIndex = 3;

    component.applyFilters();

    expect(component.pageIndex).toBe(0);
    expect(component.paginator.firstPage).toHaveBeenCalled();
    expect(moviesServiceSpy.getMovies).toHaveBeenCalled();
  });

  it('deve lidar com erro ao carregar filtros via ngOnInit', fakeAsync(() => {
    moviesServiceSpy.getFilters.and.returnValue(throwError(() => new Error('fail')));
    moviesServiceSpy.getMovies.and.returnValue(of({
      data: [],
      pagination: { currentPage: 1, totalPages: 1, totalMovies: 0, moviesPerPage: 20, hasNextPage: false, hasPrevPage: false },
      filters: { sortBy: '', order: 'asc', genero: '' }
    }));

    component.ngOnInit();
    tick();

    expect(component.erro).toBe('Erro ao carregar filtros. Tente novamente.');
    expect(component.loading).toBeFalse();
  }));

  it('deve lidar com erro ao carregar filmes via ngOnInit', fakeAsync(() => {
    moviesServiceSpy.getFilters.and.returnValue(of({
      availableGenres: [],
      availableSortFields: [],
      sortOrders: []
    }));
    moviesServiceSpy.getMovies.and.returnValue(throwError(() => new Error('fail')));

    component.ngOnInit();
    tick();

    expect(component.erro).toBe('Erro ao carregar filmes. Tente novamente.');
    expect(component.loading).toBeFalse();
  }));
});
