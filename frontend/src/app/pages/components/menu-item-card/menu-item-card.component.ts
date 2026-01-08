import { Component, inject, Input } from '@angular/core';
import { MenuItem } from '../../../model/menu-item';
import { CommonModule } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { Icons } from '../../../utils/icons';
import { CartService } from '../../../service/cart.service';

@Component({
  selector: 'app-menu-item-card',
  imports: [CommonModule, FontAwesomeModule],
  templateUrl: './menu-item-card.component.html',
  styleUrl: './menu-item-card.component.scss',
})
export class MenuItemCardComponent {
  @Input() menuItem!: MenuItem;
  cartService = inject(CartService);
  quantity = 0;

  defaultImage: string = 'images/dish.png';

  icons = Icons;

  ngOnInit(): void {
    this.cartService.cart$.subscribe(() => {
      this.quantity = this.cartService.getItemQuantity(this.menuItem.id);
    });
  }

  onIncrease(event: MouseEvent) {
    this.onAddClick(event);
  }

  onDecrease() {
    this.cartService.removeFromCart(this.menuItem);
  }

  onImageError(event: any): void {
    event.target.src = this.defaultImage;
  }

  getImageUrl(): string {
    return this.menuItem.imageUrl || this.defaultImage;
  }

  onAddClick(event: MouseEvent) {
    this.cartService.addToCart(this.menuItem);
    this.cartService.triggerAnimation(
      event.clientX,
      event.clientY,
      this.getImageUrl()
    );
  }
}
