import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  private apiUrl = 'http://localhost:8000/api/orders/'; // Adjust if using different port/path

  constructor(private http: HttpClient) {}

  getOrderHistory(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }
}
