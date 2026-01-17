import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { Icons } from '../../../utils/icons';
import {
  Router,
  RouterLink,
  RouterOutlet,
  ActivatedRoute,
} from '@angular/router';
import { CartService } from '../../../service/cart.service';
import { KitchenService } from '../../../service/kitchen.service';
import { APP_NAME } from '../../../constants/app.constant';
import { EmptyCartComponent } from '../../components/empty-cart/empty-cart.component';

@Component({
  selector: 'app-cart',
  imports: [CommonModule, FontAwesomeModule, EmptyCartComponent, RouterOutlet],
  templateUrl: './cart.component.html',
})
export class CartComponent {
  router = inject(Router);
  route = inject(ActivatedRoute);
  kitchenService = inject(KitchenService);
  cartService = inject(CartService);

  kitchen = this.kitchenService.kitchen;
  cartItems = this.cartService.cartItems;

  icons = Icons;

  ngOnInit() {
    const kitchenName = this.kitchen()?.name ?? APP_NAME;
    document.title = kitchenName + ' - Checkout';
  }

  goBack() {
    this.router.navigate(['..'], { relativeTo: this.route });
  }
}
