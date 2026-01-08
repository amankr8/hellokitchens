import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NotFoundComponent } from './pages/not-found/not-found.component';
import { KitchenService } from './service/kitchen.service';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { Icons } from './utils/icons';
import { UiService } from './service/ui.service';

@Component({
  selector: 'app-root',
  imports: [CommonModule, RouterOutlet, NotFoundComponent, FontAwesomeModule],
  templateUrl: './app.component.html',
})
export class AppComponent {
  public uiService = inject(UiService);
  public kitchenService = inject(KitchenService);
  loading = this.kitchenService.loading;
  error = this.kitchenService.error;

  icons = Icons;
  showHelp = signal(false);

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
