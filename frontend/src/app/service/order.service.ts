import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Order, OrderPayload } from '../model/order';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class OrderService {
  private http = inject(HttpClient);

  private apiUrl = environment.apiBaseUrl + '/api/v1/orders';

  placeOrder(orderPayload: OrderPayload): Observable<Order> {
    return this.http.post<Order>(this.apiUrl, orderPayload);
  }
}
