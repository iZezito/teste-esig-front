import { Injectable, signal } from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

export interface LoginResponse {
  token: string;
  usuario: string;
}

export interface LoginRequest {
  email: string;
  password: string;
  code?: string;
}

export interface CreateUser {
  nome: string;
  email: string;
  password: string
}

export interface User {
  id: number;
  nome: string;
  email: string;
  twoFactorAuthenticationEnabled: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly API_URL = 'http://localhost:8080';
  isLoggedIn = signal(false);
  user = signal<CreateUser | null>(null);

  constructor(private http: HttpClient, private router: Router) {
    this.checkToken();
  }

  private checkToken() {
    const token = localStorage.getItem('token');
    if (token) {
      this.isLoggedIn.set(true);
    }
  }

  login(data: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.API_URL}/login`, {
      login: data.email,
      senha: data.password,
      codigo: data.code
    });
  }

  register(data: CreateUser) {
    return this.http.post(`${this.API_URL}/usuarios`, data, {
      responseType: 'text'
    });
  }

  checkEmailExists(email: string): Observable<boolean> {
    return this.http.get<boolean>(`${this.API_URL}/usuarios/login/${email}`);
  }

  logout() {
    localStorage.removeItem('token');
    this.isLoggedIn.set(false);
    this.user.set(null);
    this.router.navigate(['/login']);
  }

  requestPasswordReset(email: string): Observable<string> {
    const params = new HttpParams().set('email', email);
    return this.http.post(`${this.API_URL}/usuarios/password-reset-tk`, null, {
      params,
      responseType: 'text'
    });
  }

  resetPassword(token: string, newPassword: string): Observable<string> {
    const params = new HttpParams()
      .set('token', token)
      .set('newPassword', newPassword);
    return this.http.post(`${this.API_URL}/usuarios/password-reset`, null, { params, responseType: 'text' });
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  getUserProfile(): Observable<User> {
    return this.http.get<User>(`${this.API_URL}/usuarios/`);
  }

  updateUserProfile(data: User): Observable<User> {
    return this.http.put<User>(`${this.API_URL}/usuarios/${data.id}`, data);
  }
}
