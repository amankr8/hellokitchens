import { Component } from '@angular/core';
import { Icons } from '../../../utils/icons';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

@Component({
  selector: 'app-page-not-found',
  imports: [FontAwesomeModule],
  templateUrl: './page-not-found.component.html',
})
export class PageNotFoundComponent {
  icons = Icons;

  goBack(): void {
    window.history.back();
  }
}
