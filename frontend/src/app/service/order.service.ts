import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Order, OrderPayload } from '../model/order';
import { Observable, tap } from 'rxjs';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root',
})
export class OrderService {
  private http = inject(HttpClient);

  private userService = inject(UserService);
  user = this.userService.user;

  private apiUrl = environment.apiBaseUrl + '/api/v1/orders';

  placeOrder(orderPayload: OrderPayload): Observable<Order> {
    return this.http.post<Order>(this.apiUrl, orderPayload).pipe(
      tap(() => {
        const user = this.user();
        if (!user || user.addresses?.length === 0) {
          this.userService.loadUser();
        }
      })
    );
  }
}
