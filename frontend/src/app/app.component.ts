
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TenantService } from './service/tenant.service';
import { NotFoundComponent } from './pages/not-found/not-found.component';
import { KitchenService } from './service/kitchen.service';
import { Kitchen } from './model/kitchen';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, NotFoundComponent],
  templateUrl: './app.component.html',
})
export class AppComponent {
  loading: boolean = true;

  constructor(
    private kitchenService: KitchenService,
    public tenantService: TenantService
  ) {}

  ngOnInit(): void {
    this.getKitchenDetails();
  }

  getKitchenDetails() {
    this.kitchenService.getKitchen().subscribe({
      next: (data: Kitchen) => {
        document.title = data.name + ' - Home';
        this.tenantService.kitchenDetails = data;
        this.tenantService.loaded = true;
        this.loading = false;
      },
      error: (error) => {
        document.title = 'Kitchen Not Found';
        console.error('Error fetching kitchen details:', error);
        this.tenantService.loaded = true;
        this.loading = false;
      },
    });
  }
}
