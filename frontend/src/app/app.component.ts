import { CommonModule } from '@angular/common';
import { Component, effect, inject, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { KitchenNotFoundComponent } from './pages/components/kitchen-not-found/kitchen-not-found.component';
import { KitchenService } from './service/kitchen.service';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { Icons } from './utils/icons';
import { UiToastComponent } from './pages/components/ui-toast/ui-toast.component';
import { ConfirmationModalComponent } from './pages/components/confirmation-modal/confirmation-modal.component';
import { APP_NAME } from './constants/app.constant';

@Component({
  selector: 'app-root',
  imports: [
    CommonModule,
    RouterOutlet,
    FontAwesomeModule,
    UiToastComponent,
    ConfirmationModalComponent,
    KitchenNotFoundComponent,
  ],
  templateUrl: './app.component.html',
})
export class AppComponent {
  public kitchenService = inject(KitchenService);

  kitchen = this.kitchenService.kitchen;
  loading = this.kitchenService.loading;
  error = this.kitchenService.error;

  icons = Icons;
  showHelp = signal(false);

  constructor() {
    effect(() => {
      const kitchen = this.kitchen();
      if (!kitchen) return;
      document.title = kitchen.name ?? APP_NAME;
    });
  }

  ngOnInit(): void {
    this.startLoadingTimer();
    this.kitchenService.loadKitchen();
  }

  startLoadingTimer() {
    setTimeout(() => {
      if (this.loading()) {
        this.showHelp.set(true);
      }
    }, 6000);
  }
}
