import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Juice, ServiceRecord } from '../models/juice.model';

@Injectable({
  providedIn: 'root'
})
export class JuiceService {
  private juices: Juice[] = [
    { id: 1, name: 'Orange', level: 70, maxLevel: 80, color: '#FF9800', lastRefill: new Date(Date.now() - 86400000) },
    { id: 2, name: 'Apple', level: 45, maxLevel: 75, color: '#8BC34A', lastRefill: new Date(Date.now() - 172800000) },
    { id: 3, name: 'Grape', level: 25, maxLevel: 70, color: '#9C27B0', lastRefill: new Date(Date.now() - 259200000) },
    { id: 4, name: 'Strawberry', level: 60, maxLevel: 85, color: '#E91E63', lastRefill: new Date(Date.now() - 345600000) },
    { id: 5, name: 'Blueberry', level: 82, maxLevel: 90, color: '#3F51B5', lastRefill: new Date(Date.now() - 432000000) },
    { id: 6, name: 'Mango', level: 38, maxLevel: 80, color: '#FF5722', lastRefill: new Date(Date.now() - 518400000) }
  ];

  private serviceHistory: ServiceRecord[] = [
    { id: 1, date: new Date(Date.now() - 86400000), type: 'refill', flavorId: 1, flavorName: 'Orange', previousLevel: 20, newLevel: 70, notes: 'Regular refill', technician: 'John Doe' },
    { id: 2, date: new Date(Date.now() - 172800000), type: 'maintenance', notes: 'Monthly maintenance check', technician: 'Jane Smith' },
    { id: 3, date: new Date(Date.now() - 259200000), type: 'cleaning', notes: 'Full system cleaning', technician: 'Mike Johnson' },
    { id: 4, date: new Date(Date.now() - 345600000), type: 'refill', flavorId: 4, flavorName: 'Strawberry', previousLevel: 15, newLevel: 60, notes: 'Emergency refill', technician: 'John Doe' },
    { id: 5, date: new Date(Date.now() - 432000000), type: 'refill', flavorId: 5, flavorName: 'Blueberry', previousLevel: 30, newLevel: 85, notes: 'Regular refill', technician: 'Sarah Williams' }
  ];

  private juicesSubject = new BehaviorSubject<Juice[]>(this.juices);
  private serviceHistorySubject = new BehaviorSubject<ServiceRecord[]>(this.serviceHistory);

  constructor() {}

  getJuices(): Observable<Juice[]> {
    return this.juicesSubject.asObservable();
  }

  getServiceHistory(): Observable<ServiceRecord[]> {
    return this.serviceHistorySubject.asObservable();
  }

  updateJuiceLevel(id: number, newLevel: number): void {
    const juiceIndex = this.juices.findIndex(juice => juice.id === id);
    if (juiceIndex !== -1) {
      const previousLevel = this.juices[juiceIndex].level;
      this.juices[juiceIndex].level = newLevel;
      this.juices[juiceIndex].lastRefill = new Date();
      this.juicesSubject.next([...this.juices]);

      // Add to service history
      this.addServiceRecord({
        id: this.getNextServiceId(),
        date: new Date(),
        type: 'refill',
        flavorId: id,
        flavorName: this.juices[juiceIndex].name,
        previousLevel,
        newLevel,
        notes: 'Manual level adjustment',
        technician: 'System Admin'
      });
    }
  }

  updateMaxLevel(id: number, maxLevel: number): void {
    const juiceIndex = this.juices.findIndex(juice => juice.id === id);
    if (juiceIndex !== -1) {
      this.juices[juiceIndex].maxLevel = maxLevel;
      this.juicesSubject.next([...this.juices]);
    }
  }

  addServiceRecord(record: ServiceRecord): void {
    this.serviceHistory.unshift(record);
    this.serviceHistorySubject.next([...this.serviceHistory]);
  }

  private getNextServiceId(): number {
    return this.serviceHistory.length > 0 ? 
      Math.max(...this.serviceHistory.map(record => record.id)) + 1 : 1;
  }

  needsRefill(juice: Juice): boolean {
    return juice.level <= 30;
  }

  nearMaxLevel(juice: Juice): boolean {
    return juice.level >= juice.maxLevel;
  }
}