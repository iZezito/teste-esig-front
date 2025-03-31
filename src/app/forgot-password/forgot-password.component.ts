import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import {AuthService} from '../auth/services/auth.service';
import {RouterLink} from '@angular/router';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    CardModule,
    ButtonModule,
    InputTextModule,
    ToastModule,
    RouterLink,
  ],
  providers: [MessageService],
  templateUrl: './forgot-password.component.html',
  styleUrl: './forgot-password.component.css'
})
export class ForgotPasswordComponent {

  forgotPasswordForm: FormGroup;
  isSubmitting = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private messageService: MessageService
  ) {
    this.forgotPasswordForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  onSubmit() {
    if (this.forgotPasswordForm.valid) {
      this.isSubmitting = true;
      const email = this.forgotPasswordForm.get('email')?.value as string;

      this.authService.requestPasswordReset(email).subscribe({
        next: (response) => {
          console.log('Sucesso:', response);
          this.isSubmitting = false;
          this.messageService.add({
            severity: 'success',
            summary: 'Email enviado com sucesso!',
            detail: `Um email foi enviado para ${email} contendo um link para redefinir sua senha.`
          });
          this.forgotPasswordForm.reset();
        },
        error: (error) => {
          console.error('Erro detalhado:', error);
          this.isSubmitting = false;
          this.messageService.add({
            severity: 'error',
            summary: 'Erro ao enviar o token de recuperação',
            detail: error?.error?.message || error?.message || 'Não foi possível enviar o token de recuperação de senha.'
          });
        }
      });
    }
  }

  isFieldInvalid(field: string): boolean {
    const control = this.forgotPasswordForm.get(field);
    return !!control && control.invalid && (control.dirty || control.touched);
  }

}
