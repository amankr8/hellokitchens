import { Component } from '@angular/core';

@Component({
  selector: 'app-not-found',
  imports: [],
  templateUrl: './not-found.component.html',
})
export class NotFoundComponent {
  subdomain: string = '';

  constructor() {}

  ngOnInit(): void {
    const host = window.location.hostname;
    this.subdomain = host.split('.')[0];
  }
}
