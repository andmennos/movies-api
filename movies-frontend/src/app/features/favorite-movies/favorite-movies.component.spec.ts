import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FavoriteMoviesComponent } from './favorite-movies.component';
import { FavoriteMoviesService } from './services/favorite-movies.service';
import { Movie } from '../movies/models/movie.model';

describe('FavoriteMoviesComponent', () => {
  let component: FavoriteMoviesComponent;
  let fixture: ComponentFixture<FavoriteMoviesComponent>;
  let favoriteServiceSpy: jasmine.SpyObj<FavoriteMoviesService>;

  const mockMovies: Movie[] = [
    { id: 1, nome: 'Filme A', anoLancamento: 2020, descricao: 'Desc A', genero: 'Ação' },
    { id: 2, nome: 'Filme B', anoLancamento: 2021, descricao: 'Desc B', genero: 'Comédia' }
  ];

  beforeEach(async () => {
    const spy = jasmine.createSpyObj('FavoriteMoviesService', ['getFavorite', 'remove']);

    await TestBed.configureTestingModule({
      declarations: [FavoriteMoviesComponent],
      providers: [
        { provide: FavoriteMoviesService, useValue: spy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(FavoriteMoviesComponent);
    component = fixture.componentInstance;
    favoriteServiceSpy = TestBed.inject(FavoriteMoviesService) as jasmine.SpyObj<FavoriteMoviesService>;
  });

  it('deve criar o componente', () => {
    expect(component).toBeTruthy();
  });

  it('deve carregar os filmes favoritos no ngOnInit', () => {
    favoriteServiceSpy.getFavorite.and.returnValue(mockMovies);

    component.ngOnInit();

    expect(component.favoriteMovies).toEqual(mockMovies);
    expect(favoriteServiceSpy.getFavorite).toHaveBeenCalled();
  });

  it('deve remover o filme favorito e recarregar a lista', () => {
    favoriteServiceSpy.getFavorite.and.returnValue([mockMovies[1]]);
    favoriteServiceSpy.remove.and.stub();

    component.removeFavorite(mockMovies[0]);

    expect(favoriteServiceSpy.remove).toHaveBeenCalledWith(mockMovies[0].id);
    expect(favoriteServiceSpy.getFavorite).toHaveBeenCalledTimes(1);
    expect(component.favoriteMovies).toEqual([mockMovies[1]]);
  });
});
