import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { Icons } from '../../../utils/icons';
import { MenuItem } from '../../../model/menu-item';
import { MenuService } from '../../../service/menu.service';
import { RouterLink, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-menu-list',
  imports: [CommonModule, FontAwesomeModule, RouterLink],
  templateUrl: './menu-list.component.html',
  styleUrl: './menu-list.component.scss',
})
export class MenuListComponent {
  private readonly menuService = inject(MenuService);
  icons = Icons;
  defaultImage: string = 'images/dish.png';

  menuItems = this.menuService.menuItems;
  loading = this.menuService.loading;
  error = this.menuService.error;

  ngOnInit() {
    this.menuService.loadMenuItems();
  }

  onImageError(event: any): void {
    event.target.src = this.defaultImage;
  }

  getImageUrl(imageUrl: string): string {
    return imageUrl || this.defaultImage;
  }

  toggleAvailability(item: MenuItem) {
    item.inStock = !item.inStock;
    this.menuService.toggleAvailability(item.id);
  }
}
