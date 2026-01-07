import { Component, Input } from '@angular/core';
import { MenuItem } from '../../model/menu';
import { CommonModule } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { Icons } from '../../utils/icons';

@Component({
  selector: 'app-menu-item-card',
  imports: [CommonModule, FontAwesomeModule],
  templateUrl: './menu-item-card.component.html',
  styleUrl: './menu-item-card.component.scss',
})
export class MenuItemCardComponent {
  @Input() menuItem!: MenuItem;

  defaultImage: string = 'images/dish.png';

  icons = Icons;

  onImageError(event: any): void {
    event.target.src = this.defaultImage;
  }

  getImageUrl(): string {
    return this.menuItem.imageUrl || this.defaultImage;
  }
}
