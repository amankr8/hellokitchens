import {
  Component,
  effect,
  ElementRef,
  inject,
  signal,
  viewChild,
} from '@angular/core';
import { MenuComponent } from '../components/menu/menu.component';
import { CommonModule } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { Icons } from '../../utils/icons';
import { CartService } from '../../service/cart.service';
import { KitchenService } from '../../service/kitchen.service';
import { AuthService } from '../../service/auth.service';
import { Router } from '@angular/router';
import { OtpLoginComponent } from './otp-login/otp-login.component';
import { APP_NAME } from '../../constants/app.constant';

@Component({
  selector: 'app-homepage',
  imports: [MenuComponent, CommonModule, FontAwesomeModule, OtpLoginComponent],
  templateUrl: './homepage.component.html',
  styleUrl: './homepage.component.scss',
})
export class HomepageComponent {
  private kitchenService = inject(KitchenService);
  private cartService = inject(CartService);
  private authService = inject(AuthService);
  private router = inject(Router);

  cartButton = viewChild<ElementRef>('cartButton');

  kitchen = this.kitchenService.kitchen;
  showLoginModal = signal(false);

  isCartEmpty = this.cartService.isEmpty;
  actualCartCount = this.cartService.totalCount;
  displayedCount = signal(this.actualCartCount());

  isBadgePulsing = signal(false);

  icons = Icons;

  defaultImage: string = 'images/dish.png';

  flyingItem = signal<{
    x: number;
    y: number;
    imageUrl: string;
  } | null>(null);

  flyX = signal(0);
  flyY = signal(0);
  flyStyle = signal<Record<string, string>>({});

  constructor() {
    effect(() => {
      const actual = this.actualCartCount();
      const displayed = this.displayedCount();

      if (actual < displayed) {
        this.displayedCount.set(actual);
      }
    });

    effect(() => {
      const animation = this.cartService.consumeAnimation();
      const cartButton = this.cartButton();

      if (!animation || !cartButton) return;

      this.startFlyAnimation(animation, cartButton);
    });
  }

  ngOnInit() {
    const kitchenName = this.kitchen()?.name ?? APP_NAME;
    document.title = kitchenName + ' - Home';
  }

  private startFlyAnimation(
    data: { x: number; y: number; imageUrl: string },
    cartButton: ElementRef
  ) {
    this.flyingItem.set(data);
    this.flyX.set(data.x);
    this.flyY.set(data.y);
    this.flyStyle.set({ opacity: '1', transform: 'scale(1)' });

    const rect = cartButton.nativeElement.getBoundingClientRect();
    const targetX = rect.left + rect.width / 2 - 24;
    const targetY = rect.top + rect.height / 2 - 24;

    requestAnimationFrame(() => {
      this.flyX.set(targetX);
      this.flyY.set(targetY);
      this.flyStyle.set({
        opacity: '0',
        transform: 'scale(0.2) rotate(720deg)',
        transition: 'all 0.8s cubic-bezier(0.42, 0, 0.58, 1)',
      });
    });

    setTimeout(() => {
      this.flyingItem.set(null);
    }, 800);

    setTimeout(() => {
      this.pulseBadge();
    }, 750);
  }

  private pulseBadge() {
    this.displayedCount.set(this.actualCartCount());
    this.isBadgePulsing.set(true);

    setTimeout(() => {
      this.isBadgePulsing.set(false);
    }, 300);
  }

  onViewCart(): void {
    if (this.isCartEmpty()) {
      return;
    }
    if (this.authService.isUserLogin()) {
      this.router.navigate(['/cart']);
    } else {
      this.showLoginModal.set(true);
    }
  }

  onLoginSuccess(): void {
    this.showLoginModal.set(false);
    this.router.navigate(['/cart']);
  }
}
