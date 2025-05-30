import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Juice, ServiceRecord } from '../../models/juice.model';
import { JuiceService } from '../../core/services/juice.service';
import { JuiceLevelComponent } from '../../components/juice-level/juice-level.component';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [CommonModule, FormsModule, JuiceLevelComponent],
  template: `
    <div class="settings-page">
      <h2>Dispenser Settings</h2>
      
      <div class="settings-grid">
        <div class="settings-card">
          <h3>Alert Thresholds</h3>
          <p class="settings-description">Configure when to receive alerts for low and high levels.</p>
          
          <div class="threshold-settings">
            <div class="setting-group">
              <label for="global-low-threshold">Global Low Level Alert (%)</label>
              <input 
                type="number" 
                id="global-low-threshold" 
                [(ngModel)]="globalLowThreshold" 
                min="0" 
                max="100">
              <p class="setting-help">Alerts will trigger when juice levels fall below this percentage.</p>
            </div>
          </div>
          
          <div class="actions">
            <button class="btn btn-primary" (click)="saveGlobalSettings()">Save Global Settings</button>
          </div>
        </div>
        
        <div class="settings-card">
          <h3>System Information</h3>
          <div class="info-list">
            <div class="info-item">
              <span class="info-label">Software Version:</span>
              <span class="info-value">2.5.1</span>
            </div>
            <div class="info-item">
              <span class="info-label">Last Maintenance:</span>
              <span class="info-value">{{ getLastMaintenanceDate() | date:'mediumDate' }}</span>
            </div>
            <div class="info-item">
              <span class="info-label">Total Flavors:</span>
              <span class="info-value">{{ juices.length }}</span>
            </div>
            <div class="info-item">
              <span class="info-label">Flavors Needing Refill:</span>
              <span class="info-value" [ngClass]="{'value-warning': getLowLevelCount() > 0}">
                {{ getLowLevelCount() }}
              </span>
            </div>
          </div>
        </div>
      </div>
      
      <div class="flavor-settings">
        <h3>Flavor Configuration</h3>
        <p class="settings-description">Adjust levels and thresholds for each juice flavor.</p>
        
        <div class="juice-grid">
          <div *ngFor="let juice of juices" class="juice-item">
            <app-juice-level 
              [juice]="juice" 
              [editable]="true"
              (levelChanged)="onLevelChanged($event)"
              (maxLevelChanged)="onMaxLevelChanged($event)">
            </app-juice-level>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .settings-page {
      padding: 1.5rem;
    }
    
    h2, h3 {
      color: #333;
    }
    
    h2 {
      margin-top: 0;
      margin-bottom: 1.5rem;
    }
    
    h3 {
      margin-top: 0;
      margin-bottom: 1rem;
    }
    
    .settings-description {
      color: #666;
      margin-bottom: 1.5rem;
    }
    
    .settings-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 1.5rem;
      margin-bottom: 2rem;
    }
    
    .settings-card {
      background-color: white;
      border-radius: 8px;
      box-shadow: 0 3px 10px rgba(0,0,0,0.1);
      padding: 1.5rem;
    }
    
    .setting-group {
      margin-bottom: 1.5rem;
    }
    
    label {
      display: block;
      margin-bottom: 0.5rem;
      font-weight: 500;
      color: #555;
    }
    
    input[type="number"] {
      width: 100%;
      padding: 0.5rem;
      border: 1px solid #ddd;
      border-radius: 4px;
      font-size: 1rem;
    }
    
    .setting-help {
      margin-top: 0.25rem;
      font-size: 0.875rem;
      color: #666;
    }
    
    .actions {
      margin-top: 1.5rem;
    }
    
    .btn {
      padding: 0.5rem 1rem;
      border: none;
      border-radius: 4px;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.2s ease;
    }
    
    .btn-primary {
      background-color: #1976d2;
      color: white;
    }
    
    .btn-primary:hover {
      background-color: #1565c0;
    }
    
    .info-list {
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
    }
    
    .info-item {
      display: flex;
      justify-content: space-between;
      padding-bottom: 0.75rem;
      border-bottom: 1px solid #eee;
    }
    
    .info-label {
      font-weight: 500;
      color: #555;
    }
    
    .info-value {
      font-weight: 500;
    }
    
    .value-warning {
      color: #f57c00;
    }
    
    .flavor-settings {
      margin-top: 2rem;
    }
    
    .juice-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
      gap: 1.5rem;
    }
    
    @media (max-width: 768px) {
      .settings-page {
        padding: 1rem;
      }
      
      .settings-grid {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class SettingsComponent implements OnInit {
  juices: Juice[] = [];
  globalLowThreshold: number = 30;
  
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
  
  saveGlobalSettings(): void {
    // In a real app, this would save to a backend
    // Here we'll just simulate with an alert
    alert(`Global settings saved: Low threshold set to ${this.globalLowThreshold}%`);
  }
  
  getLastMaintenanceDate(): Date {
    // Find the most recent maintenance record
    const maintenanceRecords: ServiceRecord[] = [];
    this.juiceService.getServiceHistory().subscribe(records => {
      records.forEach(record => {
        if (record.type === 'maintenance') {
          maintenanceRecords.push(record);
        }
      });
    });
    
    if (maintenanceRecords.length === 0) {
      return new Date(); // Fallback to today if no maintenance records
    }
    
    // Sort by date descending and get the first one
    maintenanceRecords.sort((a, b) => 
      new Date(b.date).getTime() - new Date(a.date).getTime()
    );
    
    return new Date(maintenanceRecords[0].date);
  }
  
  getLowLevelCount(): number {
    return this.juices.filter(juice => this.juiceService.needsRefill(juice)).length;
  }
}