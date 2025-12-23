import { Component } from '@angular/core';
import { MenuItem } from '../../model/menu';
import { MenuService } from '../../service/menu.service';
import { CommonModule } from '@angular/common';
import { MenuItemCardComponent } from '../../components/menu-item-card/menu-item-card.component';

@Component({
  selector: 'app-menu',
  imports: [CommonModule, MenuItemCardComponent],
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.scss',
})
export class MenuComponent {
  menuItems: MenuItem[] = [];
  isLoading: boolean = true;
  subdomain: string = 'taco-street';
  errorMessage: string = '';

  constructor(private menuService: MenuService) {}

  ngOnInit(): void {
    this.fetchMenuItems();
  }

  fetchMenuItems(): void {
    this.menuService.getMenuItems(this.subdomain).subscribe({
      next: (data) => {
        this.menuItems = data;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error fetching menu items:', error);
        this.errorMessage =
          'Failed to load menu items. Please try again later.';
        this.isLoading = false;
      },
    });
  }
}
