import { Injectable, signal } from '@angular/core';

export interface Toast {
  message: string;
  type: 'success' | 'error' | 'info';
}

@Injectable({
  providedIn: 'root',
})
export class UiService {
  private readonly _toast = signal<Toast | null>(null);
  readonly toast = this._toast.asReadonly();

  showToast(message: string, type: 'success' | 'error' | 'info' = 'success') {
    this._toast.set({ message, type });

    setTimeout(() => {
      this._toast.set(null);
    }, 3000);
  }

  clearToast() {
    this._toast.set(null);
  }
}
