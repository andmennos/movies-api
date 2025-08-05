import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { LoginComponent } from './login.component';
import { AuthService } from 'src/app/core/auth/auth.service';
import { Router, ActivatedRoute } from '@angular/router';
import { of, throwError } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { ResponseAuth } from 'src/app/core/auth/auth.model';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    const authSpy = jasmine.createSpyObj('AuthService', ['autenticar']);
    const routerMock = jasmine.createSpyObj('Router', ['navigateByUrl']);

    const routeMock = {
      snapshot: {
        queryParamMap: {
          get: (key: string) => key === 'urlAcesso' ? '/custom' : null
        }
      }
    };

    await TestBed.configureTestingModule({
      declarations: [LoginComponent],
      imports: [
        FormsModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
        BrowserAnimationsModule
      ],
      providers: [
        { provide: AuthService, useValue: authSpy },
        { provide: Router, useValue: routerMock },
        { provide: ActivatedRoute, useValue: routeMock }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    authServiceSpy = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    routerSpy = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    fixture.detectChanges();
  });

  it('deve criar o componente', () => {
    expect(component).toBeTruthy();
  });

  it('deve definir urlAcesso com base na query param ao iniciar', () => {
    expect(component.urlAcesso).toBe('/custom');
  });

  it('deve redirecionar ao fazer login com sucesso', fakeAsync(() => {
    const mockResponse: ResponseAuth = {
      token: 'abc123',
      message: 'Login successful',
      expiresIn: '1 minuto',
      tokenType: 'Bearer'
    };

    component.loginUser = { usuario: 'admin', senha: '123' };
    authServiceSpy.autenticar.and.returnValue(of(mockResponse));

    component.logIn();
    tick();

    expect(routerSpy.navigateByUrl).toHaveBeenCalledWith('/custom');
  }));

  it('deve exibir mensagem de erro ao falhar no login', fakeAsync(() => {
    authServiceSpy.autenticar.and.returnValue(throwError(() => new Error('Erro')));

    component.loginUser = { usuario: 'admin', senha: 'errado' };
    component.logIn();
    tick();

    expect(component.errorMessage).toBe('Usuário ou senha inválidos. Tente novamente.');
    expect(routerSpy.navigateByUrl).not.toHaveBeenCalled();
  }));
});
