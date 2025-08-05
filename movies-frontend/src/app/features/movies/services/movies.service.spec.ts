import { TestBed } from '@angular/core/testing';
import { MoviesService } from './movies.service';
import { ApiService } from 'src/app/core/api/api.service';
import { RequisicaoMovies, ResponseFilters, ResponseMovies } from '../models/movie.model';
import { of } from 'rxjs';

describe('MoviesService', () => {
  let service: MoviesService;
  let apiServiceSpy: jasmine.SpyObj<ApiService>;

  const mockResponseMovies: ResponseMovies = {
    data: [
      {
        id: 1,
        nome: 'Filme A',
        anoLancamento: 2020,
        descricao: 'Descrição A',
        genero: 'Ação'
      }
    ],
    pagination: {
      currentPage: 1,
      totalPages: 1,
      totalMovies: 1,
      moviesPerPage: 20,
      hasNextPage: false,
      hasPrevPage: false
    },
    filters: {
      sortBy: 'anoLancamento',
      order: 'asc',
      genero: ''
    }
  };

  const mockFilters: ResponseFilters = {
    availableGenres: ['Ação', 'Comédia'],
    availableSortFields: ['nome', 'anoLancamento', 'genero'],
    sortOrders: ['asc', 'desc']
  };

  beforeEach(() => {
    const spy = jasmine.createSpyObj('ApiService', ['getMovies', 'getFilters']);

    TestBed.configureTestingModule({
      providers: [
        MoviesService,
        { provide: ApiService, useValue: spy }
      ]
    });

    service = TestBed.inject(MoviesService);
    apiServiceSpy = TestBed.inject(ApiService) as jasmine.SpyObj<ApiService>;
  });

  it('deve ser criado', () => {
    expect(service).toBeTruthy();
  });

  it('deve retornar filmes ao chamar getMovies()', () => {
    const req: RequisicaoMovies = {
      page: 1,
      limit: 10,
      sortBy: 'anoLancamento',
      order: 'asc',
      genero: ''
    };

    apiServiceSpy.getMovies.and.returnValue(of(mockResponseMovies));

    service.getMovies(req).subscribe((res) => {
      expect(res).toEqual(mockResponseMovies);
    });

    expect(apiServiceSpy.getMovies).toHaveBeenCalledWith(req);
  });

  it('deve retornar filtros do cache se já estiverem carregados', () => {
    (service as any).cashFilters = mockFilters;

    service.getFilters().subscribe((res) => {
      expect(res).toEqual(mockFilters);
    });

    expect(apiServiceSpy.getFilters).not.toHaveBeenCalled();
  });

  it('deve buscar filtros da API se não houver cache', () => {
    apiServiceSpy.getFilters.and.returnValue(of(mockFilters));

    service.getFilters().subscribe((res) => {
      expect(res).toEqual(mockFilters);
      expect((service as any).cashFilters).toEqual(mockFilters);
    });

    expect(apiServiceSpy.getFilters).toHaveBeenCalledTimes(1);
  });
});
