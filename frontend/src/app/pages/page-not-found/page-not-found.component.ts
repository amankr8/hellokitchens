import { Component, inject } from '@angular/core';
import { Icons } from '../../utils/icons';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { Router, RouterLink } from '@angular/router';
import { Location } from '@angular/common';

@Component({
  selector: 'app-page-not-found',
  imports: [FontAwesomeModule],
  templateUrl: './page-not-found.component.html',
})
export class PageNotFoundComponent {
  private location = inject(Location);
  private router = inject(Router);
  icons = Icons;

  goBack(): void {
    if (window.history.length > 1) {
      this.location.back();
    } else {
      this.router.navigate(['/']);
    }
  }
}
