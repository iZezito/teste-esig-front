import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators, FormGroup, AbstractControl, ValidationErrors, AsyncValidatorFn } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { MessageModule } from 'primeng/message';
import { AuthService, CreateUser } from '../auth/services/auth.service';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { CardModule } from 'primeng/card';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

@Component({
  selector: 'app-register',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ButtonModule,
    InputTextModule,
    MessageModule,
    ToastModule,
    RouterLink,
    CardModule,
  ],
  providers: [MessageService],
  templateUrl: './register.component.html',
  standalone: true,
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  registerForm: FormGroup;
  message: string | undefined = undefined;
  isLoading = false;

  constructor(
    private authService: AuthService,
    private fb: FormBuilder,
    private router: Router,
    private messageService: MessageService
  ) {
    this.registerForm = this.fb.group({
      nome: ['Emerson', [Validators.required, Validators.minLength(2)]],
      email: [
        'emersonsilva81240@gmail.com',
        [Validators.required, Validators.email],
        [this.emailExistsValidator()]
      ],
      password: ['1234567', [Validators.required, Validators.minLength(6)]]
    });
  }

  emailExistsValidator(): AsyncValidatorFn {
    return (control: AbstractControl): Observable<ValidationErrors | null> => {
      const email = control.value;
      if (!email) {
        return of(null);
      }
      return this.authService.checkEmailExists(email).pipe(
        map(exists => (exists ? { emailExists: true } : null)),
        catchError(() => of(null))
      );
    };
  }

  onSubmit() {
    if (this.registerForm.valid) {
      this.isLoading = true;
      this.authService.register(this.registerForm.value as CreateUser).subscribe({
        next: () => {
          this.isLoading = false;
          this.messageService.add({
            severity: 'success',
            summary: 'Cadastro realizado com sucesso!',
            detail: `Um email foi enviado para ${this.registerForm.get('email')?.value} com as instruções para a confirmação da conta`
          });
        },
        error: (err) => {
          this.isLoading = false;
          this.message = err?.error?.message || 'Erro ao realizar cadastro';
          this.messageService.add({
            severity: 'error',
            summary: 'Erro no cadastro',
            detail: this.message
          });
          console.error('Register error:', err);
        }
      });
    }
  }

  isFieldInvalid(field: string): boolean {
    const control = this.registerForm.get(field);
    return !!control && control.invalid && (control.dirty || control.touched);
  }

  hasEmailExistsError(): boolean {
    const control = this.registerForm.get('email');
    return !!control && control.errors?.['emailExists'] && (control.dirty || control.touched);
  }
}
