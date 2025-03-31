import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { IconFieldModule } from 'primeng/iconfield';

@Component({
  selector: 'app-email-validation',
  standalone: true,
  imports: [
    CommonModule,
    CardModule,
    ButtonModule,
    ProgressSpinnerModule,
    IconFieldModule
  ],
  templateUrl: './email-validation.component.html',
  styleUrl: './email-validation.component.css'
})
export class EmailValidationComponent {
  isValidated: boolean | null = null;
  message: string | null = null;
  isLoading = true;
  private readonly API_URL = 'http://localhost:8080';

  constructor(
    private http: HttpClient,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    const token = this.route.snapshot.queryParams['token'];
    this.validateEmail(token);
  }

  private validateEmail(token: string) {
    this.isLoading = true;
    this.http.get(`${this.API_URL}/usuarios/verify-email`, {
      params: { token },
      responseType: 'text',
    }).subscribe({
      next: (response: string) => {
        this.isValidated = true;
        this.isLoading = false;
      },
      error: (error) => {
        this.message = error?.error || 'Não foi possível validar o email';
        this.isValidated = false;
        this.isLoading = false;
      }
    });
  }

  handleReturn() {
    this.router.navigate(['/']);
  }

}
