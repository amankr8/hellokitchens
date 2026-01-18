import { HttpClient } from '@angular/common/http';
import { computed, Injectable, signal } from '@angular/core';
import { environment } from '../../environments/environment';
import { Order, OrderPayload } from '../model/order';
import { catchError, Observable, tap, throwError } from 'rxjs';
import { OrderStatus } from '../enum/order-status.enum';

@Injectable({
  providedIn: 'root',
})
export class OrderService {
  private apiUrl = environment.apiBaseUrl + '/api/v1/orders';

  // 🔹 State signals
  private readonly _orders = signal<Order[] | null>(null);
  readonly orders = this._orders.asReadonly();

  private readonly _loading = signal(false);
  readonly loading = this._loading.asReadonly();

  private readonly _error = signal<string | null>(null);
  readonly error = this._error.asReadonly();

  readonly pendingOrders = computed(
    () => this._orders()?.filter((o) => o.status === OrderStatus.PENDING) ?? [],
  );

  readonly preparingOrders = computed(
    () =>
      this._orders()?.filter((o) => o.status === OrderStatus.PREPARING) ?? [],
  );

  readonly dispatchedOrders = computed(
    () =>
      this._orders()?.filter((o) => o.status === OrderStatus.DISPATCHED) ?? [],
  );

  constructor(private http: HttpClient) {}

  // --------------------
  // Load orders
  // --------------------
  loadOrders(): void {
    if (this._orders() !== null || this._loading()) return;
    this.fetchOrders();
  }

  refreshOrders(): void {
    this.fetchOrders();
  }

  private fetchOrders(): void {
    if (this._loading()) return;

    this._loading.set(true);
    this._error.set(null);

    this.http.get<Order[]>(this.apiUrl).subscribe({
      next: (items) => {
        this._orders.set(items);
        this._loading.set(false);
      },
      error: () => {
        this._error.set('Failed to load orders');
        this._loading.set(false);
      },
    });
  }

  // --------------------
  // Mutations
  // --------------------
  placeOrder(orderPayload: OrderPayload): Observable<Order> {
    return this.http.post<Order>(this.apiUrl, orderPayload);
  }

  updateOrderStatus(orderId: number, status: string): Observable<Order> {
    return this.http
      .patch<Order>(`${this.apiUrl}/${orderId}/update`, null, {
        params: { status },
      })
      .pipe(
        tap((updatedOrder) => {
          if (this._orders() === null) {
            this.refreshOrders();
          } else {
            this.replaceOrder(updatedOrder);
          }
        }),
      );
  }

  private replaceOrder(updated: Order): void {
    this._orders.update((orders) =>
      orders!.map((o) => (o.id === updated.id ? updated : o)),
    );
  }
}
