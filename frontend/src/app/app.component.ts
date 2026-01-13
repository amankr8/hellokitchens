import { CommonModule } from '@angular/common';
import { Component, effect, inject, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NotFoundComponent } from './pages/not-found/not-found.component';
import { KitchenService } from './service/kitchen.service';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { Icons } from './utils/icons';
import { UiToastComponent } from './pages/components/ui-toast/ui-toast.component';
import { ConfirmationModalComponent } from './pages/components/confirmation-modal/confirmation-modal.component';

@Component({
  selector: 'app-root',
  imports: [
    CommonModule,
    RouterOutlet,
    NotFoundComponent,
    FontAwesomeModule,
    UiToastComponent,
    ConfirmationModalComponent,
  ],
  templateUrl: './app.component.html',
})
export class AppComponent {
  public kitchenService = inject(KitchenService);
  loading = this.kitchenService.loading;
  error = this.kitchenService.error;

  kitchen = this.kitchenService.kitchen;

  icons = Icons;
  showHelp = signal(false);

  constructor() {
    effect(() => {
      const kitchen = this.kitchen();

      if (!kitchen) return;

      document.title = (kitchen.name ?? 'LiveMenu') + ' -';
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
