import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Icons } from '../../utils/icons';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

@Component({
  selector: 'app-page-not-found',
  imports: [FontAwesomeModule],
  templateUrl: './page-not-found.component.html',
})
export class PageNotFoundComponent {
  icons = Icons;

  constructor(private router: Router) {}

  goBack(): void {
    if (window.history.length > 0) {
      window.history.back();
    } else {
      this.router.navigate(['/']);
    }
  }
}
