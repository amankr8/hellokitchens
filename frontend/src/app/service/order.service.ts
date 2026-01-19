import { HttpClient } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
import { environment } from '../../environments/environment';
import { Order, OrderPayload } from '../model/order';
import { catchError, Observable, tap, throwError } from 'rxjs';
import { OrderStatus } from '../enum/order-status.enum';

import { Client } from '@stomp/stompjs';
import { KitchenService } from './kitchen.service';
import { UiService } from './ui.service';

@Injectable({
  providedIn: 'root',
})
export class OrderService {
  private stompClient: Client;
  http = inject(HttpClient);
  kitchenService = inject(KitchenService);
  uiService = inject(UiService);

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

  private notificationSound = new Audio('audio/notification.mp3');

  constructor() {
    this.notificationSound.load();
    this.stompClient = new Client({
      brokerURL: environment.apiBaseUrl + '/ws-orders',
      heartbeatIncoming: 10000,
      heartbeatOutgoing: 10000,
      reconnectDelay: 5000,
      debug: (str) => console.log(str),
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
      this.notificationSound.currentTime = 0;
      this.notificationSound
        .play()
        .catch((e) => console.warn('Audio blocked', e));
      this.uiService.showToast('Incoming Order! Ticket #' + order.id, 'info');
      this._orders.update((orders) => [...orders!, order]);
    }
  }

  updateOrderStatus(orderId: number, newStatus: string): Observable<Order> {
    const existingOrders = this._orders();
    this._orders.update((orders) =>
      orders!.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o)),
    );

    return this.http
      .patch<Order>(`${this.apiUrl}/${orderId}/update`, null, {
        params: { newStatus },
      })
      .pipe(
        catchError((err) => {
          this._orders.set(existingOrders);
          return throwError(() => err);
        }),
      );
  }

  discardOrder(orderId: number): Observable<void> {
    const existingOrders = this._orders();
    this._orders.update((orders) =>
      orders!.map((o) =>
        o.id === orderId ? { ...o, status: OrderStatus.CANCELLED } : o,
      ),
    );

    return this.http.delete<void>(`${this.apiUrl}/${orderId}`).pipe(
      catchError((err) => {
        this._orders.set(existingOrders);
        return throwError(() => err);
      }),
    );
  }
}
