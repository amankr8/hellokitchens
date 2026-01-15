import { Component } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { Icons } from '../../../utils/icons';

@Component({
  selector: 'app-kitchen-not-found',
  imports: [FontAwesomeModule],
  templateUrl: './kitchen-not-found.component.html',
})
export class KitchenNotFoundComponent {
  subdomain: string = '';

  icons = Icons;

  constructor() {}

  ngOnInit(): void {
    const host = window.location.hostname;
    this.subdomain = host.split('.')[0];
  }

  goBack(): void {
    window.history.back();
  }
}
