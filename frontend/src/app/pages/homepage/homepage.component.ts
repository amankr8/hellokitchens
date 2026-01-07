import { Component } from '@angular/core';
import { MenuComponent } from '../../components/menu/menu.component';
import { KitchenService } from '../../service/kitchen.service';
import { TenantService } from '../../service/tenant.service';


@Component({
  selector: 'app-homepage',
  imports: [MenuComponent],
  templateUrl: './homepage.component.html',
})
export class HomepageComponent {
  loading: boolean = true;
  kitchenName: string = '';
  kitchenTagline: string = '';

  constructor(
    private kitchenService: KitchenService,
    public tenantService: TenantService
  ) {}

  ngOnInit(): void {
    let kitchen = this.tenantService.kitchenDetails;
    if (kitchen) {
      this.kitchenName = kitchen.name;
      this.kitchenTagline = kitchen.tagline;
    }
  }
}
