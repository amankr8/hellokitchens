import { Component } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { Icons } from '../../../utils/icons';
import { Router } from '@angular/router';

@Component({
  selector: 'app-kitchen-not-found',
  imports: [FontAwesomeModule],
  templateUrl: './kitchen-not-found.component.html',
})
export class KitchenNotFoundComponent {
  subdomain: string = '';

  icons = Icons;

  constructor(private router: Router) {}

  ngOnInit(): void {
    const host = window.location.hostname;
    this.subdomain = host.split('.')[0];
  }

  goBack(): void {
    if (window.history.length > 0) {
      window.history.back();
    } else {
      this.router.navigate(['/']);
    }
  }
}
