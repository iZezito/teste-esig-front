import { Routes } from '@angular/router';
import {LoginComponent} from './login/login.component';
import {publicGuard} from './auth/guards/public.guard';
import {RegisterComponent} from './register/register.component';
import {authGuard} from './auth/guards/auth.guard';
import {EmailValidationComponent} from './email-validation/email-validation.component';
import {CreateTarefaComponent} from './tarefa/create-tarefa/create-tarefa.component';
import {ListTarefaComponent} from './tarefa/list-tarefa/list-tarefa.component';
import {ForgotPasswordComponent} from './forgot-password/forgot-password.component';
import {ResetPasswordComponent} from './reset-password/reset-password.component';
import {OauthSuccessComponent} from './oauth-success/oauth-success.component';
import {ProfileComponent} from './profile/profile.component';


export const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent,
    canActivate: [publicGuard]
  },
  {
    path: 'register',
    component: RegisterComponent,
    canActivate: [publicGuard]
  },
  {
    path: 'home',
    component: ListTarefaComponent,
    canActivate: [authGuard]
  },
  {
    path: 'validate-email',
    component: EmailValidationComponent
  },
  {
    path: 'tarefa',
    component: CreateTarefaComponent,
    canActivate: [authGuard]
  },
  {
    path: 'tarefa/:id',
    component: CreateTarefaComponent,
    canActivate: [authGuard]
  },
  { path: 'profile', component: ProfileComponent, canActivate: [authGuard] },
  { path: 'forgot-password', component: ForgotPasswordComponent },
  { path: 'reset-password', component: ResetPasswordComponent },
  { path: 'oauth-success', component: OauthSuccessComponent },
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: '**', redirectTo: '/login' }
];
