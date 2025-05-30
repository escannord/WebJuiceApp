import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <header class="header">
      <div class="logo">
        <span class="logo-icon">🧃</span>
        <h1>JuiceFlow</h1>
      </div>
      <nav>
        <a routerLink="/dashboard/overview" routerLinkActive="active">Dashboard</a>
        <a routerLink="/dashboard/history" routerLinkActive="active">History</a>
        <a routerLink="/dashboard/settings" routerLinkActive="active">Settings</a>
        
        <!-- Logout Button (Visible Only When Logged In) -->
        <ng-container *ngIf="authService.isLoggedIn()">
          <button class="logout-btn" (click)="onLogout()">
            <span>Logout</span>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
              <polyline points="16 17 21 12 16 7"></polyline>
              <line x1="21" y1="12" x2="9" y2="12"></line>
            </svg>
          </button>
        </ng-container>
      </nav>
    </header>
  `,
  styles: [`
    .header {
      background: linear-gradient(135deg, #ff7e5f, #feb47b);
      color: white;
      padding: 1rem 2rem;
      display: flex;
      justify-content: space-between;
      align-items: center;
      box-shadow: 0 2px 5px rgba(0,0,0,0.1);
    }

    .logo {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .logo-icon {
      font-size: 1.5rem;
    }

    h1 {
      margin: 0;
      font-weight: 500;
      font-size: 1.5rem;
    }

    nav {
      display: flex;
      gap: 1.5rem;
      align-items: center;
    }

    a {
      color: white;
      text-decoration: none;
      font-weight: 500;
      padding: 0.5rem 0;
      position: relative;
      transition: all 0.3s ease;
    }

    a::after {
      content: '';
      position: absolute;
      bottom: 0;
      left: 0;
      width: 0;
      height: 2px;
      background-color: white;
      transition: width 0.3s ease;
    }

    a:hover::after, a.active::after {
      width: 100%;
    }

    /* Logout Button Styling */
    .logout-btn {
      background: transparent;
      border: none;
      color: white;
      display: flex;
      align-items: center;
      gap: 0.5rem;
      cursor: pointer;
      font-weight: 500;
      padding: 0.5rem 0;
      font-family: inherit;
      transition: opacity 0.3s ease;
    }

    .logout-btn:hover {
      opacity: 0.8;
    }

    .logout-btn svg {
      transition: transform 0.3s ease;
    }

    .logout-btn:hover svg {
      transform: translateX(3px);
    }

    @media (max-width: 600px) {
      .header {
        flex-direction: column;
        padding: 1rem;
      }

      nav {
        margin-top: 1rem;
        gap: 1rem;
      }
    }
  `]
})
export class HeaderComponent {
  constructor(public authService: AuthService) {} // Make authService public for template access

  onLogout() {
    this.authService.logout();
  }
}