import { Injectable, signal } from '@angular/core';

export interface Toast {
  message: string;
  type: 'success' | 'error' | 'info';
}

export interface ConfirmConfig {
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  action: () => void;
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

  private readonly _confirmReq = signal<ConfirmConfig | null>(null);
  readonly confirmReq = this._confirmReq.asReadonly();

  ask(config: ConfirmConfig) {
    this._confirmReq.set(config);
  }

  closeConfirm() {
    this._confirmReq.set(null);
  }
}
