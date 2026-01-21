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
  private http = inject(HttpClient);
  private kitchenService = inject(KitchenService);
  private uiService = inject(UiService);

  private apiUrl = environment.apiBaseUrl + '/api/v1/orders';

  // 🔹 State signals
  private readonly _kitchenOrders = signal<Order[] | null>(null);
  readonly kitchenOrders = this._kitchenOrders.asReadonly();

  private readonly _userOrders = signal<Order[] | null>(null);
  readonly userOrders = this._userOrders.asReadonly();

  private readonly _loading = signal(false);
  readonly loading = this._loading.asReadonly();

  private readonly _error = signal<string | null>(null);
  readonly error = this._error.asReadonly();

  readonly pendingKitchenOrders = computed(
    () =>
      this._kitchenOrders()?.filter((o) => o.status === OrderStatus.PENDING) ??
      [],
  );

  readonly preparingKitchenOrders = computed(
    () =>
      this._kitchenOrders()?.filter(
        (o) => o.status === OrderStatus.PREPARING,
      ) ?? [],
  );

  readonly dispatchedKitchenOrders = computed(
    () =>
      this._kitchenOrders()?.filter(
        (o) => o.status === OrderStatus.DISPATCHED,
      ) ?? [],
  );

  private notificationSound = new Audio('audio/notification.mp3');

  constructor() {
    this.stompClient = new Client({
      brokerURL: environment.apiBaseUrl + '/ws-orders',
      heartbeatIncoming: 10000,
      heartbeatOutgoing: 10000,
      reconnectDelay: 5000,
      debug: (str) => console.log(str),
    });
  }

  wsConnect() {
    this.notificationSound.load();
    this.stompClient.onConnect = () => {
      console.log('Connected to Spring Boot WS');

      const kitchenId = this.kitchenService.kitchen()?.id;
      this.stompClient.subscribe(`/topic/kitchen/${kitchenId}`, (message) => {
        const newOrder = JSON.parse(message.body) as Order;
        this.notificationSound.currentTime = 0;
        this.notificationSound
          .play()
          .catch((e) => console.warn('Audio blocked', e));
        this.uiService.showToast(
          'Incoming Order! Ticket #' + newOrder.id,
          'info',
        );
        this.handleNewOrder(newOrder);
      });
    };

    this.stompClient.activate();
  }

  // --------------------
  // Load orders
  // --------------------
  loadKitchenOrders(): void {
    if (this._kitchenOrders() !== null || this._loading()) return;
    this.fetchKitchenOrders();
  }

  refreshKitchenOrders(): void {
    this.fetchKitchenOrders();
  }

  private fetchKitchenOrders(): void {
    if (this._loading()) return;

    this._loading.set(true);
    this._error.set(null);

    this.http.get<Order[]>(this.apiUrl).subscribe({
      next: (items) => {
        this._kitchenOrders.set(items);
        this._loading.set(false);
      },
      error: () => {
        this._error.set('Failed to load orders');
        this._loading.set(false);
      },
    });
  }

  loadUserOrders(): void {
    if (this._userOrders() !== null || this._loading()) return;
    this.fetchUserOrders();
  }

  refreshUserOrders(): void {
    this.fetchUserOrders();
  }

  private fetchUserOrders(): void {
    if (this._loading()) return;

    this._loading.set(true);
    this._error.set(null);

    this.http.get<Order[]>(`${this.apiUrl}/user`).subscribe({
      next: (items) => {
        this._userOrders.set(items);
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
  private handleNewOrder(order: Order): void {
    if (!this._kitchenOrders()) {
      this.refreshKitchenOrders();
    } else {
      this._kitchenOrders.update((orders) => [...orders!, order]);
    }
  }

  placeOrder(orderPayload: OrderPayload): Observable<Order> {
    return this.http.post<Order>(this.apiUrl, orderPayload).pipe(
      tap((order) => {
        if (this._userOrders() === null) {
          this.refreshUserOrders();
        } else {
          this._userOrders.update((orders) => [...orders!, order]);
        }
      }),
    );
  }

  updateOrderStatus(orderId: number, newStatus: string): Observable<Order> {
    const existingOrders = this._kitchenOrders();
    this._kitchenOrders.update((orders) =>
      orders!.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o)),
    );

    return this.http
      .patch<Order>(`${this.apiUrl}/${orderId}/update`, null, {
        params: { newStatus },
      })
      .pipe(
        catchError((err) => {
          this._kitchenOrders.set(existingOrders);
          return throwError(() => err);
        }),
      );
  }

  discardOrder(orderId: number): Observable<void> {
    const existingOrders = this._kitchenOrders();
    this._kitchenOrders.update((orders) =>
      orders!.map((o) =>
        o.id === orderId ? { ...o, status: OrderStatus.CANCELLED } : o,
      ),
    );

    return this.http.delete<void>(`${this.apiUrl}/${orderId}`).pipe(
      catchError((err) => {
        this._kitchenOrders.set(existingOrders);
        return throwError(() => err);
      }),
    );
  }
}
