import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

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
        <a routerLink="/dashboard" routerLinkActive="active">Dashboard</a>
        <a routerLink="/history" routerLinkActive="active">History</a>
        <a routerLink="/settings" routerLinkActive="active">Settings</a>
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
export class HeaderComponent {}