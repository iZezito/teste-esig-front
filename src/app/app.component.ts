import {Component, WritableSignal} from '@angular/core';
import {Router, RouterModule, RouterOutlet} from '@angular/router';
import {AuthService} from './auth/services/auth.service';
import {MenuItem} from 'primeng/api';
import {CommonModule} from '@angular/common';
import {MenubarModule} from 'primeng/menubar';
import {BadgeModule} from 'primeng/badge';
import {MenuModule} from 'primeng/menu';
import {ButtonModule} from 'primeng/button';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterOutlet,
    CommonModule,
    RouterModule,
    MenubarModule,
    BadgeModule,
    MenuModule,
    ButtonModule],
  templateUrl: './app.component.html',
  standalone: true,
  styleUrl: './app.component.css'
})
export class AppComponent {
  menuItems: MenuItem[] = [
    {
      label: 'Tarefas',
      icon: 'pi pi-list',
      routerLink: '/home'
    },
    {
      label: 'Criar Nova Tarefa',
      icon: 'pi pi-plus',
      routerLink: '/tarefa'
    }
  ];

  userMenuItems: MenuItem[] = [
    {
      label: 'Perfil',
      icon: 'pi pi-user',
      routerLink: '/profile'
    },
    {
      label: 'Sair',
      icon: 'pi pi-sign-out',
      command: () => this.logout()
    }
  ];

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  isAuthenticated(): boolean {
    return this.authService.isLoggedIn();
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
