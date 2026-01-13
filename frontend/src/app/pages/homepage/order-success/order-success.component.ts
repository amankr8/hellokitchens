import { Component, input } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { Icons } from '../../../utils/icons';

@Component({
  selector: 'app-order-success',
  imports: [FontAwesomeModule],
  templateUrl: './order-success.component.html',
})
export class OrderSuccessComponent {
  orderId = input<string>(); // From route params
  icons = Icons;

  // You can use a library like 'ngx-lottie' or a simple <img> for the GIF/Lottie
  confettiAnimation =
    'https://assets9.lottiefiles.com/packages/lf20_u4y3699e.json';
}
