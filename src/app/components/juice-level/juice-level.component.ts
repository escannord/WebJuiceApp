import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Juice } from '../../models/juice.model';

@Component({
  selector: 'app-juice-level',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="juice-card" [ngClass]="{'low-level': isLowLevel(), 'high-level': isHighLevel()}">
      <h3>{{ juice.name }}</h3>
      <div class="level-container">
        <div class="level-indicator">
          <div class="level-fill" 
              [style.height.%]="juice.level" 
              [style.backgroundColor]="juice.color">
            <div class="level-bubbles" *ngIf="juice.level > 0"></div>
          </div>
          <div class="max-level-line" [style.bottom.%]="juice.maxLevel"></div>
        </div>
        <div class="level-labels">
          <span class="level-value">{{ juice.level }}%</span>
          <span class="level-max">Max: {{ juice.maxLevel }}%</span>
        </div>
      </div>
      <div class="controls" *ngIf="editable">
        <div class="adjust-level">
          <label for="level-{{juice.id}}">Level:</label>
          <input 
            type="range" 
            id="level-{{juice.id}}" 
            min="0" 
            max="100" 
            [(ngModel)]="juice.level" 
            (change)="onLevelChange()">
        </div>
        <div class="adjust-max">
          <label for="max-{{juice.id}}">Max Threshold:</label>
          <input 
            type="range" 
            id="max-{{juice.id}}" 
            min="0" 
            max="100" 
            [(ngModel)]="juice.maxLevel" 
            (change)="onMaxLevelChange()">
        </div>
      </div>
      <div class="status-indicators">
        <div class="status" *ngIf="isLowLevel()">
          <span class="status-icon">⚠️</span> Low level
        </div>
        <div class="status" *ngIf="isHighLevel()">
          <span class="status-icon">⚠️</span> Near max
        </div>
        <div class="last-refill" *ngIf="juice.lastRefill">
          <span>Last refill: {{ juice.lastRefill | date:'short' }}</span>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .juice-card {
      background-color: white;
      border-radius: 8px;
      box-shadow: 0 3px 10px rgba(0,0,0,0.1);
      padding: 1rem;
      display: flex;
      flex-direction: column;
      transition: all 0.3s ease;
      height: 100%;
    }

    .juice-card.low-level {
      box-shadow: 0 3px 10px rgba(255, 87, 34, 0.3);
    }

    .juice-card.high-level {
      box-shadow: 0 3px 10px rgba(63, 81, 181, 0.3);
    }

    h3 {
      margin-top: 0;
      margin-bottom: 0.75rem;
      color: #333;
      text-align: center;
    }

    .level-container {
      display: flex;
      height: 150px;
      margin-bottom: 1rem;
    }

    .level-indicator {
      flex: 1;
      background-color: #f5f5f5;
      border-radius: 4px;
      position: relative;
      overflow: hidden;
      margin-right: 0.5rem;
    }

    .level-fill {
      position: absolute;
      bottom: 0;
      left: 0;
      width: 100%;
      transition: height 0.5s ease;
      border-radius: 0 0 4px 4px;
    }

    .level-bubbles {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: 
        radial-gradient(circle at 20% 30%, rgba(255, 255, 255, 0.3) 4px, transparent 6px),
        radial-gradient(circle at 75% 60%, rgba(255, 255, 255, 0.3) 5px, transparent 7px),
        radial-gradient(circle at 40% 80%, rgba(255, 255, 255, 0.3) 3px, transparent 5px);
      animation: rise 3s infinite;
    }

    @keyframes rise {
      0%, 100% {
        transform: translateY(0);
      }
      50% {
        transform: translateY(-10px);
      }
    }

    .max-level-line {
      position: absolute;
      left: 0;
      width: 100%;
      height: 2px;
      background-color: rgba(0, 0, 0, 0.3);
      z-index: 2;
    }

    .level-labels {
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      font-size: 0.875rem;
      width: 60px;
    }

    .level-value {
      font-weight: bold;
      font-size: 1rem;
    }

    .controls {
      margin-top: 0.5rem;
      margin-bottom: 0.5rem;
    }

    label {
      display: block;
      margin-bottom: 0.25rem;
      font-size: 0.875rem;
      color: #666;
    }

    input[type="range"] {
      width: 100%;
      margin-bottom: 0.75rem;
    }

    .status-indicators {
      margin-top: auto;
      font-size: 0.875rem;
    }

    .status {
      display: flex;
      align-items: center;
      margin-bottom: 0.25rem;
      color: #e65100;
      font-weight: 500;
    }

    .status-icon {
      margin-right: 0.25rem;
    }

    .last-refill {
      color: #666;
      font-size: 0.75rem;
      margin-top: 0.5rem;
    }
  `]
})
export class JuiceLevelComponent {
  @Input() juice!: Juice;
  @Input() editable: boolean = false;
  
  @Output() levelChanged = new EventEmitter<{id: number, level: number}>();
  @Output() maxLevelChanged = new EventEmitter<{id: number, maxLevel: number}>();

  isLowLevel(): boolean {
    return this.juice.level <= 30;
  }

  isHighLevel(): boolean {
    return this.juice.level >= this.juice.maxLevel;
  }

  onLevelChange(): void {
    this.levelChanged.emit({
      id: this.juice.id, 
      level: this.juice.level
    });
  }

  onMaxLevelChange(): void {
    this.maxLevelChanged.emit({
      id: this.juice.id, 
      maxLevel: this.juice.maxLevel
    });
  }
}