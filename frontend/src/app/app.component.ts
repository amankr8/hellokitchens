import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NotFoundComponent } from './pages/not-found/not-found.component';
import { KitchenService } from './service/kitchen.service';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { Icons } from './utils/icons';

@Component({
  selector: 'app-root',
  imports: [CommonModule, RouterOutlet, NotFoundComponent, FontAwesomeModule],
  templateUrl: './app.component.html',
})
export class AppComponent {
  public kitchenService = inject(KitchenService);
  loading = this.kitchenService.loading;

  icons = Icons;
  showHelp: boolean = false;

  ngOnInit(): void {
    this.startLoadingTimer();
    this.kitchenService.loadKitchen();
  }

  startLoadingTimer() {
    setTimeout(() => {
      if (this.loading()) {
        this.showHelp = true;
      }
    }, 6000);
  }
}
