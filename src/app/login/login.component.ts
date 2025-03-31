import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { MessageModule } from 'primeng/message';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { InputOtpModule } from 'primeng/inputotp';
import {AuthService, CreateUser, LoginRequest, LoginResponse} from '../auth/services/auth.service';
import { CardModule } from 'primeng/card';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ButtonModule,
    InputTextModule,
    MessageModule,
    ToastModule,
    InputOtpModule,
    RouterLink,
    CardModule,
  ],
  providers: [MessageService],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  loginForm: FormGroup;
  isSubmitting = false;
  requires2FA = false;
  errorMessage: string | null = null;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthService,
    private messageService: MessageService
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      code: ['']
    });
  }

  onSubmit() {
    if (this.loginForm.valid) {
      this.isSubmitting = true;
      this.errorMessage = null;
      const formValue = this.loginForm.value as LoginRequest;

      this.authService.login(formValue).subscribe({
        next: (response: LoginResponse) => {
          this.isSubmitting = false;
          localStorage.setItem('token', response.token);
          this.authService.isLoggedIn.set(true);
          this.authService.user.set({nome: response.usuario} as CreateUser);
          this.router.navigate(['/']);
        },
        error: (error) => {
          this.isSubmitting = false;
          if (error.status === 202) {
            this.requires2FA = true;
            this.loginForm.get('code')?.setValidators(Validators.required);
            this.loginForm.get('code')?.updateValueAndValidity();
            this.messageService.add({
              severity: 'info',
              summary: 'Código 2FA Necessário',
              detail: 'Digite o código enviado ao seu dispositivo.'
            });
          } else {
            this.errorMessage = error?.error || 'Erro ao efetuar login';
            this.messageService.add({
              severity: 'error',
              summary: 'Erro no Login',
              detail: this.errorMessage ?? 'Erro desconhecido'
            });
          }
        }
      });
    }
  }

  handleGoogleLogin() {
    window.location.href = 'http://localhost:8080/oauth2/authorization/google';
  }

  isFieldInvalid(field: string): boolean {
    const control = this.loginForm.get(field);
    return !!control && control.invalid && (control.dirty || control.touched);
  }
}
