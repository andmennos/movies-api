import { TestBed } from '@angular/core/testing';
import { ApiService } from './api.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { environment } from 'src/environments.ts/environment';
import { RequestAuth, ResponseAuth } from '../auth/auth.model';
import { RequisicaoMovies, ResponseFilters, ResponseMovies } from 'src/app/features/movies/models/movie.model';

describe('ApiService', () => {
  let service: ApiService;
  let httpMock: HttpTestingController;
  const baseUrl = environment.baseUrl;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ApiService]
    });

    service = TestBed.inject(ApiService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('deve ser criado', () => {
    expect(service).toBeTruthy();
  });

  it('deve autenticar o login corretamente', () => {
    const login: RequestAuth = { usuario: 'admin', senha: '123' };
    const response: ResponseAuth = {
      message: 'ok',
      token: 'fake-token',
      expiresIn: '3600',
      tokenType: 'Bearer'
    };

    service.autenticarLogin(login).subscribe(result => {
      expect(result).toEqual(response);
    });

    const req = httpMock.expectOne(`${baseUrl}/auth/login`);
    expect(req.request.method).toBe('POST');
    req.flush(response);
  });

  it('deve buscar filmes com filtros corretos', () => {
    const reqParams: RequisicaoMovies = {
      page: 1,
      limit: 10,
      sortBy: 'anoLancamento',
      order: 'asc',
      genero: 'Ação'
    };

    const response: ResponseMovies = {
      data: [],
      pagination: {
        currentPage: 1,
        totalPages: 1,
        totalMovies: 0,
        moviesPerPage: 10,
        hasNextPage: false,
        hasPrevPage: false
      },
      filters: {
        sortBy: 'anoLancamento',
        order: 'asc',
        genero: 'Ação'
      }
    };

    service.getMovies(reqParams).subscribe(result => {
      expect(result).toEqual(response);
    });

    const req = httpMock.expectOne(request =>
      request.url === `${baseUrl}/movies` &&
      request.params.get('page') === '1' &&
      request.params.get('limit') === '10' &&
      request.params.get('sortBy') === 'anoLancamento' &&
      request.params.get('order') === 'asc' &&
      request.params.get('genero') === 'Ação'
    );

    expect(req.request.method).toBe('GET');
    req.flush(response);
  });

  it('deve buscar os filtros disponíveis', () => {
    const filters: ResponseFilters = {
      availableGenres: ['Ação', 'Comédia'],
      availableSortFields: ['nome', 'anoLancamento'],
      sortOrders: ['asc', 'desc']
    };

    service.getFilters().subscribe(result => {
      expect(result).toEqual(filters);
    });

    const req = httpMock.expectOne(`${baseUrl}/movies/filters`);
    expect(req.request.method).toBe('GET');
    req.flush(filters);
  });
});
