import {
  Component,
  ElementRef,
  inject,
  signal,
  ViewChild,
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

  @ViewChild('cartButton') cartButton!: ElementRef;

  kitchen = this.kitchenService.kitchen;
  showLoginModal = signal(false);

  displayedCount = 0;
  actualCartCount = 0;

  icons = Icons;

  flyX = 0;
  flyY = 0;
  flyingItem: any = null;
  flyStyle = {};
  isBadgePulsing = false;

  ngOnInit(): void {
    const kitchenName = this.kitchen()?.name ?? 'LiveMenu';
    document.title = kitchenName + ' - Home';
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

    const targetX = rect.left + rect.width / 2 - 24;
    const targetY = rect.top + rect.height / 2 - 24;

    setTimeout(() => {
      this.flyX = targetX;
      this.flyY = targetY;
      this.flyStyle = {
        opacity: '0',
        transform: 'scale(0.2) rotate(720deg)',
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

  onViewCart() {
    if (this.authService.isUserLogin()) {
      this.router.navigate(['/cart']);
    } else {
      this.showLoginModal.set(true);
    }
  }

  onLoginSuccess() {
    this.showLoginModal.set(false);
    this.router.navigate(['/cart']);
  }
}
