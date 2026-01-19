import { HttpClient } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
import { environment } from '../../environments/environment';
import { Order, OrderPayload } from '../model/order';
import { Observable, tap } from 'rxjs';
import { OrderStatus } from '../enum/order-status.enum';

import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { KitchenService } from './kitchen.service';

@Injectable({
  providedIn: 'root',
})
export class OrderService {
  private stompClient: Client;
  http = inject(HttpClient);
  kitchenService = inject(KitchenService);

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

  constructor() {
    this.stompClient = new Client({
      webSocketFactory: () => new SockJS(environment.apiBaseUrl + '/ws-orders'),
      debug: (str) => console.log(str),
      reconnectDelay: 5000,
    });

    this.stompClient.onConnect = () => {
      console.log('Connected to Spring Boot WS');

      const kitchenId = this.kitchenService.kitchen()?.id;
      this.stompClient.subscribe(`/topic/kitchen/${kitchenId}`, (message) => {
        const newOrder = JSON.parse(message.body);
        this.appendOrder(newOrder);
      });
    };

    this.stompClient.activate();
  }

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

  private appendOrder(order: Order): void {
    if (!this._orders()) {
      this.refreshOrders();
    } else {
      this._orders.update((orders) => [...orders!, order]);
    }
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
