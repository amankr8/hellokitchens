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
  menuItems: MenuItem[] = [];
  loading: boolean = false;
  error: string = '';

  defaultImage: string = 'images/dish.png';

  icons = Icons;

  menuService = inject(MenuService);

  ngOnInit() {
    this.fetchMenuItems();
  }

  onImageError(event: any): void {
    event.target.src = this.defaultImage;
  }

  getImageUrl(imageUrl: string): string {
    return imageUrl || this.defaultImage;
  }

  fetchMenuItems(): void {
    this.menuService.getMenuItems().subscribe({
      next: (data: MenuItem[]) => {
        this.menuItems = data;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error fetching menu items:', error);
        this.error = 'Failed to load menu items. Please try again later.';
        this.loading = false;
      },
    });
  }

  toggleAvailability(item: MenuItem) {
    item.inStock = !item.inStock;
    this.menuService.toggleAvailability(item.id);
  }
}
