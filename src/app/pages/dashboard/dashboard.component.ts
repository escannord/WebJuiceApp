import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Juice } from '../../models/juice.model';
import { JuiceService } from '../../core/services/juice.service';
import { JuiceLevelComponent } from '../../components/juice-level/juice-level.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, JuiceLevelComponent],
  template: `
    <div class="dashboard">
      <div class="dashboard-header">
        <h2>Juice Dispenser Dashboard</h2>
        <div class="system-status" [ngClass]="getSystemStatusClass()">
          System Status: {{ getSystemStatus() }}
        </div>
      </div>

      <div class="alert-summary" *ngIf="hasAlerts()">
        <div class="alert">
          <span class="alert-icon">🚨</span>
          <span>{{ getLowLevelCount() }} flavors are running low!</span>
        </div>
        <div class="alert" *ngIf="getNearMaxCount() > 0">
          <span class="alert-icon">⚠️</span>
          <span>{{ getNearMaxCount() }} flavors are near max capacity!</span>
        </div>
      </div>

      <div class="juice-grid">
        <div *ngFor="let juice of juices" class="juice-item">
          <app-juice-level 
            [juice]="juice" 
            (levelChanged)="onLevelChanged($event)"
            (maxLevelChanged)="onMaxLevelChanged($event)">
          </app-juice-level>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .dashboard {
      padding: 1.5rem;
    }

    .dashboard-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1.5rem;
    }

    h2 {
      margin: 0;
      color: #333;
    }

    .system-status {
      padding: 0.5rem 1rem;
      border-radius: 20px;
      font-weight: 500;
      font-size: 0.875rem;
    }

    .status-ok {
      background-color: #e8f5e9;
      color: #2e7d32;
    }

    .status-warning {
      background-color: #fff8e1;
      color: #ff8f00;
    }

    .status-alert {
      background-color: #ffebee;
      color: #c62828;
    }

    .alert-summary {
      background-color: #fff8e1;
      border-radius: 8px;
      padding: 1rem;
      margin-bottom: 1.5rem;
      display: flex;
      flex-wrap: wrap;
      gap: 1rem;
    }

    .alert {
      display: flex;
      align-items: center;
      font-weight: 500;
    }

    .alert-icon {
      margin-right: 0.5rem;
    }

    .juice-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
      gap: 1.5rem;
    }

    @media (max-width: 600px) {
      .dashboard {
        padding: 1rem;
      }

      .dashboard-header {
        flex-direction: column;
        align-items: flex-start;
        gap: 0.75rem;
      }

      .juice-grid {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class DashboardComponent implements OnInit {
  juices: Juice[] = [];

  constructor(private juiceService: JuiceService) {}

  ngOnInit(): void {
    this.juiceService.getJuices().subscribe(juices => {
      this.juices = juices;
    });
  }

  onLevelChanged(event: {id: number, level: number}): void {
    this.juiceService.updateJuiceLevel(event.id, event.level);
  }

  onMaxLevelChanged(event: {id: number, maxLevel: number}): void {
    this.juiceService.updateMaxLevel(event.id, event.maxLevel);
  }

  getSystemStatus(): string {
    if (this.getLowLevelCount() > 2) {
      return 'Critical - Multiple Low Levels';
    } else if (this.getLowLevelCount() > 0) {
      return 'Warning - Low Levels';
    } else if (this.getNearMaxCount() > 0) {
      return 'Warning - Near Max Capacity';
    } else {
      return 'Normal';
    }
  }

  getSystemStatusClass(): string {
    if (this.getLowLevelCount() > 2) {
      return 'status-alert';
    } else if (this.getLowLevelCount() > 0 || this.getNearMaxCount() > 0) {
      return 'status-warning';
    } else {
      return 'status-ok';
    }
  }

  hasAlerts(): boolean {
    return this.getLowLevelCount() > 0 || this.getNearMaxCount() > 0;
  }

  getLowLevelCount(): number {
    return this.juices.filter(juice => this.juiceService.needsRefill(juice)).length;
  }

  getNearMaxCount(): number {
    return this.juices.filter(juice => this.juiceService.nearMaxLevel(juice)).length;
  }
}