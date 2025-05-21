export interface Juice {
  id: number;
  name: string;
  level: number;
  maxLevel: number;
  color: string;
  lastRefill?: Date;
}

export interface ServiceRecord {
  id: number;
  date: Date;
  type: 'refill' | 'maintenance' | 'cleaning';
  flavorId?: number;
  flavorName?: string;
  previousLevel?: number;
  newLevel?: number;
  notes?: string;
  technician?: string;
}