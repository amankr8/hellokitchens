import { Component, computed, inject, Input } from '@angular/core';
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

  quantity = this.cartService.itemQuantity(this.menuItem?.id);

  defaultImage: string = 'images/dish.png';

  icons = Icons;

  onIncrease(event: MouseEvent): void {
    this.onAddClick(event);
  }

  onDecrease(): void {
    this.cartService.removeFromCart(this.menuItem);
  }

  onImageError(event: any): void {
    event.target.src = this.defaultImage;
  }

  getImageUrl(): string {
    return this.menuItem.imageUrl || this.defaultImage;
  }

  onAddClick(event: MouseEvent): void {
    this.cartService.addToCart(this.menuItem);
    this.cartService.triggerAnimation(
      event.clientX,
      event.clientY,
      this.getImageUrl()
    );
  }
}
