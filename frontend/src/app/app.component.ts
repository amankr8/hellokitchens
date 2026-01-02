import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TenantService } from './service/tenant.service';
import { NotFoundComponent } from './pages/not-found/not-found.component';

@Component({
  selector: 'app-root',
  imports: [CommonModule, RouterOutlet, NotFoundComponent],
  templateUrl: './app.component.html',
})
export class AppComponent {
  title = 'LiveMenu';
  constructor(public tenantService: TenantService) {}
}
