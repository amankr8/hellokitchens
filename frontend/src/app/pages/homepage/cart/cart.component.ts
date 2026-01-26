import { CommonModule, Location } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { Icons } from '../../../utils/icons';
import { RouterOutlet } from '@angular/router';
import { CartService } from '../../../service/cart.service';
import { KitchenService } from '../../../service/kitchen.service';
import { APP_NAME } from '../../../constants/app.constant';
import { EmptyCartComponent } from '../empty-cart/empty-cart.component';

@Component({
  selector: 'app-cart',
  imports: [CommonModule, FontAwesomeModule, EmptyCartComponent, RouterOutlet],
  templateUrl: './cart.component.html',
})
export class CartComponent {
  location = inject(Location);
  kitchenService = inject(KitchenService);
  cartService = inject(CartService);

  kitchen = this.kitchenService.kitchen;
  cartEntries = this.cartService.cartEntries;

  icons = Icons;

  ngOnInit() {
    const kitchenName = this.kitchen()?.name ?? APP_NAME;
    document.title = kitchenName + ' - Checkout';
  }
}
