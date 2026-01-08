import { Component, inject } from '@angular/core';
import { MenuItem } from '../../../model/menu-item';
import { MenuService } from '../../../service/menu.service';
import { CommonModule } from '@angular/common';
import { MenuItemCardComponent } from '../menu-item-card/menu-item-card.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { Icons } from '../../../utils/icons';

@Component({
  selector: 'app-menu',
  imports: [CommonModule, MenuItemCardComponent, FontAwesomeModule],
  templateUrl: './menu.component.html',
})
export class MenuComponent {
  icons = Icons;

  private menuService = inject(MenuService);
  menuItems = this.menuService.menuItems;
  loading = this.menuService.loading;
  error = this.menuService.error;

  ngOnInit(): void {
    this.menuService.loadMenuItems();
  }

  trackById(index: number, item: MenuItem) {
    return item.id;
  }
}
