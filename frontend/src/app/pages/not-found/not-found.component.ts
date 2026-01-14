import { Component } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { Icons } from '../../utils/icons';

@Component({
  selector: 'app-not-found',
  imports: [FontAwesomeModule],
  templateUrl: './not-found.component.html',
})
export class NotFoundComponent {
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
