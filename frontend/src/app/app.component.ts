import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TenantService } from './service/tenant.service';
import { NotFoundComponent } from './pages/not-found/not-found.component';
import { KitchenService } from './service/kitchen.service';
import { Kitchen } from './model/kitchen';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { Icons } from './utils/icons';

@Component({
  selector: 'app-root',
  imports: [CommonModule, RouterOutlet, NotFoundComponent, FontAwesomeModule],
  templateUrl: './app.component.html',
})
export class AppComponent {
  loading: boolean = true;
  showHelp: boolean = false;

  icons = Icons;

  constructor(
    private kitchenService: KitchenService,
    public tenantService: TenantService
  ) {}

  ngOnInit(): void {
    this.startLoadingTimer();
    this.getKitchenDetails();
  }

  startLoadingTimer() {
    setTimeout(() => {
      if (this.loading) {
        this.showHelp = true;
      }
    }, 6000);
  }

  getKitchenDetails() {
    this.kitchenService.getKitchen().subscribe({
      next: (data: Kitchen) => {
        document.title = data.name + ' - Home';
        this.tenantService.setKitchenDetails(data);
        this.loading = false;
      },
      error: (error) => {
        document.title = 'Kitchen Not Found';
        console.error('Error fetching kitchen details:', error);
        this.loading = false;
      },
    });
  }
}
