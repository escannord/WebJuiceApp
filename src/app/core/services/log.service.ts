import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Juice, LogType, ServiceRecord } from '../../models/juice.model';
import { environment } from '../../../environments/environment.development';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class LogService {
  private readonly apiBaseUrl = environment.apiBaseUrl;
  private logSubject = new BehaviorSubject<LogType[]>([]);

  constructor(private http: HttpClient) {}

  getLogs(): Observable<LogType[]> {
    return this.http.get<any>(`${this.apiBaseUrl}/logs`); 
  }
}