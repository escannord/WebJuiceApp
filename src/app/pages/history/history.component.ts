import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ServiceRecord } from '../../models/juice.model';
import { JuiceService } from '../../services/juice.service';

@Component({
  selector: 'app-history',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="history-page">
      <h2>Service History</h2>
      
      <div class="filters">
        <div class="filter-group">
          <label for="filter-type">Filter by Type:</label>
          <select id="filter-type" [(ngModel)]="filterType" (change)="applyFilters()">
            <option value="all">All Types</option>
            <option value="refill">Refill</option>
            <option value="maintenance">Maintenance</option>
            <option value="cleaning">Cleaning</option>
          </select>
        </div>
        
        <div class="filter-group">
          <label for="filter-date">Filter by Date Range:</label>
          <div class="date-inputs">
            <input type="date" id="date-from" [(ngModel)]="dateFrom" (change)="applyFilters()">
            <span>to</span>
            <input type="date" id="date-to" [(ngModel)]="dateTo" (change)="applyFilters()">
          </div>
        </div>
      </div>
      
      <div class="history-table-container">
        <table class="history-table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Type</th>
              <th>Flavor</th>
              <th>Details</th>
              <th>Technician</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let record of filteredRecords" [ngClass]="getRecordClass(record)">
              <td>{{ record.date | date:'medium' }}</td>
              <td>
                <span class="record-type" [ngClass]="'type-' + record.type">
                  {{ record.type | titlecase }}
                </span>
              </td>
              <td>{{ record.flavorName || '-' }}</td>
              <td>
                <ng-container *ngIf="record.type === 'refill'">
                  Level changed: {{ record.previousLevel }}% → {{ record.newLevel }}%
                </ng-container>
                <ng-container *ngIf="record.notes">
                  {{ record.notes }}
                </ng-container>
              </td>
              <td>{{ record.technician }}</td>
            </tr>
            <tr *ngIf="filteredRecords.length === 0">
              <td colspan="5" class="no-records">No records found matching your filters.</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  `,
  styles: [`
    .history-page {
      padding: 1.5rem;
    }
    
    h2 {
      margin-top: 0;
      margin-bottom: 1.5rem;
      color: #333;
    }
    
    .filters {
      background-color: #f5f5f5;
      padding: 1rem;
      border-radius: 8px;
      margin-bottom: 1.5rem;
      display: flex;
      flex-wrap: wrap;
      gap: 1.5rem;
    }
    
    .filter-group {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }
    
    label {
      font-weight: 500;
      font-size: 0.875rem;
      color: #555;
    }
    
    select, input {
      padding: 0.5rem;
      border: 1px solid #ddd;
      border-radius: 4px;
      font-size: 0.875rem;
    }
    
    .date-inputs {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }
    
    .history-table-container {
      overflow-x: auto;
    }
    
    .history-table {
      width: 100%;
      border-collapse: collapse;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
      border-radius: 8px;
      overflow: hidden;
    }
    
    th, td {
      padding: 0.75rem 1rem;
      text-align: left;
    }
    
    th {
      background-color: #f0f0f0;
      font-weight: 500;
      color: #333;
    }
    
    tr:nth-child(even) {
      background-color: #f9f9f9;
    }
    
    tr:hover {
      background-color: #f0f7ff;
    }
    
    .record-type {
      display: inline-block;
      padding: 0.25rem 0.5rem;
      border-radius: 4px;
      font-size: 0.75rem;
      font-weight: 500;
    }
    
    .type-refill {
      background-color: #e3f2fd;
      color: #1565c0;
    }
    
    .type-maintenance {
      background-color: #fff8e1;
      color: #ff8f00;
    }
    
    .type-cleaning {
      background-color: #e8f5e9;
      color: #2e7d32;
    }
    
    .no-records {
      text-align: center;
      color: #666;
      padding: 2rem !important;
    }
    
    @media (max-width: 768px) {
      .filters {
        flex-direction: column;
        gap: 1rem;
      }
      
      .history-table th, .history-table td {
        padding: 0.5rem;
      }
    }
  `]
})
export class HistoryComponent implements OnInit {
  serviceRecords: ServiceRecord[] = [];
  filteredRecords: ServiceRecord[] = [];
  
  filterType: string = 'all';
  dateFrom: string = '';
  dateTo: string = '';
  
  constructor(private juiceService: JuiceService) {}
  
  ngOnInit(): void {
    this.juiceService.getServiceHistory().subscribe(records => {
      this.serviceRecords = records;
      this.filteredRecords = [...records];
      
      // Initialize date filters to last 30 days by default
      const today = new Date();
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(today.getDate() - 30);
      
      this.dateTo = this.formatDate(today);
      this.dateFrom = this.formatDate(thirtyDaysAgo);
      
      this.applyFilters();
    });
  }
  
  applyFilters(): void {
    let filtered = [...this.serviceRecords];
    
    // Apply type filter
    if (this.filterType !== 'all') {
      filtered = filtered.filter(record => record.type === this.filterType);
    }
    
    // Apply date filters
    if (this.dateFrom) {
      const fromDate = new Date(this.dateFrom);
      filtered = filtered.filter(record => new Date(record.date) >= fromDate);
    }
    
    if (this.dateTo) {
      const toDate = new Date(this.dateTo);
      toDate.setHours(23, 59, 59, 999); // Set to end of day
      filtered = filtered.filter(record => new Date(record.date) <= toDate);
    }
    
    this.filteredRecords = filtered;
  }
  
  getRecordClass(record: ServiceRecord): string {
    return `record-${record.type}`;
  }
  
  private formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }
}