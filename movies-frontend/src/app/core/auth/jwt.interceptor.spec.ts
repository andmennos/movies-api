import { TestBed } from '@angular/core/testing';
import { JwtInterceptor } from './jwt.interceptor';
import { AuthService } from './auth.service';
import { Router } from '@angular/router';
import {
  HttpRequest,
  HttpHandler,
  HttpResponse,
  HttpErrorResponse
} from '@angular/common/http';
import { of, throwError } from 'rxjs';

describe('JwtInterceptor', () => {
  let interceptor: JwtInterceptor;
  let authServiceSpy: jasmine.SpyObj<AuthService>;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(() => {
    const authSpy = jasmine.createSpyObj('AuthService', ['getToken', 'logout']);
    const routerMock = jasmine.createSpyObj('Router', ['navigate']);

    TestBed.configureTestingModule({
      providers: [
        JwtInterceptor,
        { provide: AuthService, useValue: authSpy },
        { provide: Router, useValue: routerMock }
      ]
    });

    interceptor = TestBed.inject(JwtInterceptor);
    authServiceSpy = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    routerSpy = TestBed.inject(Router) as jasmine.SpyObj<Router>;
  });

  it('deve adicionar o header Authorization quando o token existir', (done) => {
    const token = 'fake-token';
    authServiceSpy.getToken.and.returnValue(token);

    const request = new HttpRequest('GET', '/test');
    const next: HttpHandler = {
      handle: (req: HttpRequest<any>) => {
        expect(req.headers.has('Authorization')).toBeTrue();
        expect(req.headers.get('Authorization')).toBe(`Bearer ${token}`);
        return of(new HttpResponse({ status: 200 }));
      }
    };

    interceptor.intercept(request, next).subscribe({
      next: event => {
        expect(event instanceof HttpResponse).toBeTrue();
        done();
      },
      error: () => {
        fail('Não deveria ocorrer erro');
        done();
      }
    });
  });

  it('deve passar a requisição sem alterações quando não houver token', (done) => {
    authServiceSpy.getToken.and.returnValue(null);

    const request = new HttpRequest('GET', '/test');
    const next: HttpHandler = {
      handle: (req: HttpRequest<any>) => {
        expect(req.headers.has('Authorization')).toBeFalse();
        return of(new HttpResponse({ status: 200 }));
      }
    };

    interceptor.intercept(request, next).subscribe({
      next: event => {
        expect(event instanceof HttpResponse).toBeTrue();
        done();
      },
      error: () => {
        fail('Não deveria ocorrer erro');
        done();
      }
    });
  });

  it('deve realizar logout e redirecionar para /login em erro 401', (done) => {
    authServiceSpy.getToken.and.returnValue('token');
    authServiceSpy.logout.and.stub();

    const request = new HttpRequest('GET', '/test');
    const next: HttpHandler = {
      handle: (req: HttpRequest<any>) => {
        return throwError(() => new HttpErrorResponse({ status: 401 }));
      }
    };

    interceptor.intercept(request, next).subscribe({
      next: () => {
        fail('Deveria lançar erro');
        done();
      },
      error: (error) => {
        expect(authServiceSpy.logout).toHaveBeenCalled();
        expect(routerSpy.navigate).toHaveBeenCalledWith(['/login']);
        expect(error.status).toBe(401);
        done();
      }
    });
  });

  it('deve realizar logout e redirecionar para /login em erro 403', (done) => {
    authServiceSpy.getToken.and.returnValue('token');
    authServiceSpy.logout.and.stub();

    const request = new HttpRequest('GET', '/test');
    const next: HttpHandler = {
      handle: (req: HttpRequest<any>) => {
        return throwError(() => new HttpErrorResponse({ status: 403 }));
      }
    };

    interceptor.intercept(request, next).subscribe({
      next: () => {
        fail('Deveria lançar erro');
        done();
      },
      error: (error) => {
        expect(authServiceSpy.logout).toHaveBeenCalled();
        expect(routerSpy.navigate).toHaveBeenCalledWith(['/login']);
        expect(error.status).toBe(403);
        done();
      }
    });
  });
});
