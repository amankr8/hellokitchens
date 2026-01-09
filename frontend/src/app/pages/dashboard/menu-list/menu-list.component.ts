import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { Icons } from '../../../utils/icons';
import { MenuItem } from '../../../model/menu-item';
import { MenuService } from '../../../service/menu.service';
import { RouterLink, RouterOutlet } from '@angular/router';
import { UiService } from '../../../service/ui.service';

@Component({
  selector: 'app-menu-list',
  imports: [CommonModule, FontAwesomeModule, RouterLink],
  templateUrl: './menu-list.component.html',
  styleUrl: './menu-list.component.scss',
})
export class MenuListComponent {
  private readonly menuService = inject(MenuService);
  private uiService = inject(UiService);
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
    this.menuService.toggleAvailability(item.id).subscribe({
      next: () => this.uiService.showToast('Item status updated'),
      error: () => {
        item.inStock = !item.inStock;
        this.uiService.showToast(
          'Failed to update item status. Please try again',
          'error'
        );
      },
    });
  }

  onDeleteItem(item: MenuItem) {
    this.uiService.ask({
      title: 'Remove Dish?',
      message: `Are you sure you want to remove "${item.name}" from your menu? This action cannot be undone.`,
      confirmText: 'Yes, Remove',
      action: () => {
        this.menuService.deleteItem(item.id).subscribe({
          next: () => this.uiService.showToast('Item deleted successfully'),
          error: () =>
            this.uiService.showToast('Failed to delete item', 'error'),
        });
      },
    });
  }
}
