import { Component } from '@angular/core';
import { MenuItem } from '../../model/menu';
import { MenuService } from '../../service/menu.service';
import { CommonModule } from '@angular/common';
import { MenuItemCardComponent } from '../menu-item-card/menu-item-card.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { Icons } from '../../utils/icons';

@Component({
  selector: 'app-menu',
  imports: [CommonModule, MenuItemCardComponent, FontAwesomeModule],
  templateUrl: './menu.component.html',
})
export class MenuComponent {
  menuItems: MenuItem[] = [];
  loading: boolean = true;
  skeletons = Array(6);
  error: string = '';
  icons = Icons;

  constructor(private menuService: MenuService) {}

  ngOnInit(): void {
    this.fetchMenuItems();
  }

  trackById(index: number, item: MenuItem) {
    return item.id;
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
}
