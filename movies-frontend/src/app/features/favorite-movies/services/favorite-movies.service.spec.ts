import { TestBed } from '@angular/core/testing';
import { FavoriteMoviesService } from './favorite-movies.service';
import { Movie } from '../../movies/models/movie.model';

describe('FavoriteMoviesService', () => {
  let service: FavoriteMoviesService;

  const mockMovie: Movie = {
    id: 1,
    nome: 'Interestelar',
    anoLancamento: 2014,
    descricao: 'Uma jornada pelo espaço e pelo tempo.',
    genero: 'Ficção'
  };

  const anotherMovie: Movie = {
    id: 2,
    nome: 'A Origem',
    anoLancamento: 2010,
    descricao: 'Inception: um sonho dentro de outro.',
    genero: 'Ação'
  };

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FavoriteMoviesService);
    service.clear();
  });

  it('deve ser criado corretamente', () => {
    expect(service).toBeTruthy();
  });

  it('deve adicionar um filme aos favoritos', () => {
    service.toggleFavorite(mockMovie);
    expect(service.isFavorite(mockMovie.id)).toBeTrue();
    expect(service.getFavorite()).toContain(mockMovie);
  });

  it('deve remover um filme dos favoritos com toggle', () => {
    service.toggleFavorite(mockMovie);
    service.toggleFavorite(mockMovie);
    expect(service.isFavorite(mockMovie.id)).toBeFalse();
    expect(service.getFavorite()).not.toContain(mockMovie);
  });

  it('deve remover um filme diretamente pelo ID', () => {
    service.toggleFavorite(mockMovie);
    service.remove(mockMovie.id);
    expect(service.isFavorite(mockMovie.id)).toBeFalse();
    expect(service.getFavorite()).not.toContain(mockMovie);
  });

  it('deve retornar todos os favoritos corretamente', () => {
    service.toggleFavorite(mockMovie);
    service.toggleFavorite(anotherMovie);
    const favoritos = service.getFavorite();
    expect(favoritos.length).toBe(2);
    expect(favoritos).toContain(mockMovie);
    expect(favoritos).toContain(anotherMovie);
  });

  it('deve limpar todos os favoritos', () => {
    service.toggleFavorite(mockMovie);
    service.toggleFavorite(anotherMovie);
    service.clear();
    expect(service.getFavorite().length).toBe(0);
    expect(service.isFavorite(mockMovie.id)).toBeFalse();
    expect(service.isFavorite(anotherMovie.id)).toBeFalse();
  });
});
