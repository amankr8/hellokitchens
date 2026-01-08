import { Component, ElementRef, inject, ViewChild } from '@angular/core';
import { MenuComponent } from '../../components/menu/menu.component';
import { CommonModule } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { Icons } from '../../utils/icons';
import { CartService } from '../../service/cart.service';
import { KitchenService } from '../../service/kitchen.service';

@Component({
  selector: 'app-homepage',
  imports: [MenuComponent, CommonModule, FontAwesomeModule],
  templateUrl: './homepage.component.html',
  styleUrl: './homepage.component.scss',
})
export class HomepageComponent {
  kitchenService = inject(KitchenService);
  cartService = inject(CartService);

  @ViewChild('cartButton') cartButton!: ElementRef;

  kitchen = this.kitchenService.kitchen;

  displayedCount = 0;
  actualCartCount = 0;
  icons = Icons;

  flyX = 0;
  flyY = 0;
  flyingItem: any = null;
  flyStyle = {};
  isBadgePulsing = false;

  ngOnInit(): void {
    this.kitchenService.loadKitchen();
    this.cartService.cart$.subscribe(() => {
      this.actualCartCount = this.cartService.getTotalCount();
      if (this.actualCartCount < this.displayedCount) {
        this.displayedCount = this.actualCartCount;
      }
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

    const rect = this.cartButton.nativeElement.getBoundingClientRect();

    const targetX = rect.left + rect.width / 2 - 24; // subtract half ghost width
    const targetY = rect.top + rect.height / 2 - 24;

    setTimeout(() => {
      this.flyX = targetX;
      this.flyY = targetY;
      this.flyStyle = {
        opacity: '0',
        transform: 'scale(0.2) rotate(720deg)', // Extra spin for flair!
        transition: 'all 0.8s cubic-bezier(0.42, 0, 0.58, 1)',
      };
    }, 10);

    setTimeout(() => {
      this.flyingItem = null;
    }, 800);

    setTimeout(() => {
      this.displayedCount = this.actualCartCount;
      this.isBadgePulsing = true;
      setTimeout(() => {
        this.isBadgePulsing = false;
      }, 300);
    }, 750);
  }
}
