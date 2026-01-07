import { Component, ElementRef, inject, ViewChild } from '@angular/core';
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
  styleUrl: './homepage.component.scss',
})
export class HomepageComponent {
  @ViewChild('cartButton') cartButton!: ElementRef;

  loading: boolean = true;
  kitchenName: string = '';
  kitchenTagline: string = '';
  kitchenNumber: string = '';
  displayedCount = 0;
  actualCartCount = 0;
  icons = Icons;

  flyX = 0;
  flyY = 0;
  flyingItem: any = null;
  flyStyle = {};
  isBadgePulsing = false;

  tenantService = inject(TenantService);
  cartService = inject(CartService);

  ngOnInit(): void {
    let kitchen = this.tenantService.kitchenDetails();
    if (kitchen) {
      this.kitchenName = kitchen.name;
      this.kitchenTagline = kitchen.tagline;
      this.kitchenNumber = kitchen.whatsapp;
    }
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
