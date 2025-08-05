import { TestBed } from '@angular/core/testing';
import { AuthService } from './auth.service';
import { ApiService } from '../api/api.service';
import { of } from 'rxjs';

describe('AuthService', () => {
  let service: AuthService;
  let apiServiceSpy: jasmine.SpyObj<ApiService>;

  beforeEach(() => {
    const spy = jasmine.createSpyObj('ApiService', ['autenticarLogin']);

    TestBed.configureTestingModule({
      providers: [
        AuthService,
        { provide: ApiService, useValue: spy }
      ]
    });

    service = TestBed.inject(AuthService);
    apiServiceSpy = TestBed.inject(ApiService) as jasmine.SpyObj<ApiService>;

    sessionStorage.clear();
  });

  it('deve ser criado', () => {
    expect(service).toBeTruthy();
  });

  it('deve armazenar o token após autenticação com sucesso', (done) => {
    const fakeResponse = {
      message: 'Success',
      token: 'fake-token-123',
      expiresIn: '3600',
      tokenType: 'Bearer'
    };

    apiServiceSpy.autenticarLogin.and.returnValue(of(fakeResponse));

    service.autenticar({ usuario: 'user', senha: 'pass' }).subscribe({
      next: () => {
        expect(sessionStorage.getItem('access_token')).toBe('fake-token-123');
        done();
      },
      error: () => {
        fail('Não deveria ocorrer erro');
        done();
      }
    });
  });

  it('getToken deve recuperar o token do sessionStorage', () => {
    sessionStorage.setItem('access_token', 'meu-token');
    expect(service.getToken()).toBe('meu-token');
  });

  it('isLogged deve retornar true quando o token existir', () => {
    sessionStorage.setItem('access_token', 'token-existente');
    expect(service.isLogged()).toBeTrue();
  });

  it('isLogged deve retornar false quando o token não existir', () => {
    expect(service.isLogged()).toBeFalse();
  });

  it('logout deve remover o token do sessionStorage', () => {
    sessionStorage.setItem('access_token', 'token-para-remover');
    service.logout();
    expect(sessionStorage.getItem('access_token')).toBeNull();
  });
});
