import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { Icons } from '../../../utils/icons';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-empty-cart',
  imports: [FontAwesomeModule, CommonModule, RouterLink],
  templateUrl: './empty-cart.component.html',
})
export class EmptyCartComponent {
  icons = Icons;
}
