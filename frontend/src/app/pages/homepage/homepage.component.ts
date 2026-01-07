import { Component, inject } from '@angular/core';
import { MenuComponent } from '../../components/menu/menu.component';
import { TenantService } from '../../service/tenant.service';
import { CommonModule } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { Icons } from '../../utils/icons';
import { CartService } from '../../service/cart.service';

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
  cartCount = 0;
  icons = Icons;

  flyX = 0;
  flyY = 0;
  flyingItem: any = null;
  flyStyle = {};

  tenantService = inject(TenantService);
  cartService = inject(CartService);

  ngOnInit(): void {
    let kitchen = this.tenantService.kitchenDetails;
    if (kitchen) {
      this.kitchenName = kitchen.name;
      this.kitchenTagline = kitchen.tagline;
      this.kitchenNumber = kitchen.whatsapp;
    }
    this.cartService.cart$.subscribe(() => {
      this.cartCount = this.cartService.getTotalCount();
    });
    this.cartService.animate$.subscribe((data) => {
      this.startFlyAnimation(data);
    });
  }

  startFlyAnimation(data: any) {
    this.flyingItem = data;
    this.flyX = data.x;
    this.flyY = data.y;
    this.flyStyle = { opacity: '1', transform: 'scale(1)' };

    // Wait a tiny bit for the browser to register the starting position
    setTimeout(() => {
      // Target: The cart button position (approximate top right)
      this.flyX = window.innerWidth - 100;
      this.flyY = 40;
      this.flyStyle = {
        opacity: '0',
        transform: 'scale(0.2) rotate(360deg)',
        transition: 'all 0.8s cubic-bezier(0.42, 0, 0.58, 1)',
      };
    }, 10);

    // Clean up
    setTimeout(() => {
      this.flyingItem = null;
    }, 800);
  }
}
