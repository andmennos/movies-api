import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { RequestAuth } from 'src/app/core/auth/auth.model';
import { AuthService } from 'src/app/core/auth/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit{
  loginUser: RequestAuth = {usuario: '', senha: ''};
  errorMessage!: string;
  urlAcesso!: string;

  constructor(
    private authService: AuthService,
    private router: Router, 
    private route: ActivatedRoute){
  }

  ngOnInit(): void {
    this.urlAcesso = this.route.snapshot.queryParamMap.get('urlAcesso') || '/home';
  }

  logIn() {
    this.authService.autenticar(this.loginUser).subscribe({
      next: () => {
        this.router.navigateByUrl(this.urlAcesso);
      },
      error: () => {
        this.errorMessage = 'Usuário ou senha inválidos. Tente novamente.'
      }
    })
  }


}
