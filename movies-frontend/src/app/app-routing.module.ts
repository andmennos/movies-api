import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { authGuard } from './core/auth/auth.guard';
import { LoginComponent } from './pages/login/login.component';
import { FavoriteMoviesComponent } from './features/favorite-movies/favorite-movies.component';
import { MoviesComponent } from './features/movies/movies.component';

const routes: Routes = [
  { path: 'login', component: LoginComponent },

  {
    path: 'home', component: HomeComponent,
    canActivate: [authGuard],
    children: [
      { path: '', component: MoviesComponent},
      { path: 'favoritos', component:FavoriteMoviesComponent}
    ]
  },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: '**',
    redirectTo: 'home'
  }

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
