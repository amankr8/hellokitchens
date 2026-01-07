import { Component } from '@angular/core';
import { MenuComponent } from '../../components/menu/menu.component';
import { KitchenService } from '../../service/kitchen.service';
import { TenantService } from '../../service/tenant.service';
import { CommonModule } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { Icons } from '../../utils/icons';

@Component({
  selector: 'app-homepage',
  imports: [MenuComponent, CommonModule, FontAwesomeModule],
  templateUrl: './homepage.component.html',
})
export class HomepageComponent {
  loading: boolean = true;
  kitchenName: string = '';
  kitchenTagline: string = '';
  kitchenNumber: string = '';
  icons = Icons;

  constructor(public tenantService: TenantService) {
    this.kitchenNumber = this.tenantService.kitchenDetails?.whatsapp || '';
  }

  ngOnInit(): void {
    let kitchen = this.tenantService.kitchenDetails;
    if (kitchen) {
      this.kitchenName = kitchen.name;
      this.kitchenTagline = kitchen.tagline;
    }
  }
}
