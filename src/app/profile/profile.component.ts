import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { CheckboxModule } from 'primeng/checkbox';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import {AuthService, User} from '../auth/services/auth.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    CardModule,
    ButtonModule,
    InputTextModule,
    CheckboxModule,
    ToastModule
  ],
  providers: [MessageService],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent {
  profileForm: FormGroup;
  isSubmitting = false;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthService,
    private messageService: MessageService
  ) {
    this.profileForm = this.fb.group({
      id: [null],
      nome: ['', Validators.required],
      email: [{ value: '', disabled: true }],
      twoFactorAuthenticationEnabled: [false]
    });
  }

  ngOnInit() {
    this.loadProfile();
  }

  loadProfile() {
    this.authService.getUserProfile().subscribe({
      next: (profile: User) => {
        this.profileForm.patchValue({
          id: profile.id,
          nome: profile.nome,
          email: profile.email,
          twoFactorAuthenticationEnabled: profile.twoFactorAuthenticationEnabled
        });
      },
      error: () => {
        this.messageService.add({
          severity: 'error',
          summary: 'Erro',
          detail: 'Não foi possível carregar os dados do perfil.'
        });
        this.router.navigate(['/login']);
      }
    });
  }

  onSubmit() {
    if (this.profileForm.valid) {
      this.isSubmitting = true;
      const formValue = this.profileForm.getRawValue() as User;

      const updateData: User = {
        id: formValue.id,
        nome: formValue.nome,
        twoFactorAuthenticationEnabled: formValue.twoFactorAuthenticationEnabled,
        email: formValue.email
      };

      this.authService.updateUserProfile(updateData).subscribe({
        next: (updatedProfile: User) => {
          this.isSubmitting = false;
          this.messageService.add({
            severity: 'success',
            summary: 'Sucesso',
            detail: 'Perfil atualizado com sucesso!'
          });
          this.profileForm.patchValue(updatedProfile);
        },
        error: (error) => {
          this.isSubmitting = false;
          this.messageService.add({
            severity: 'error',
            summary: 'Erro',
            detail: error?.error || 'Não foi possível atualizar o perfil.'
          });
        }
      });
    }
  }

  isFieldInvalid(field: string): boolean {
    const control = this.profileForm.get(field);
    return !!control && control.invalid && (control.dirty || control.touched);
  }
}
