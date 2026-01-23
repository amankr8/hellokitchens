import { Component, Input } from '@angular/core';
import { Icons } from '../../../utils/icons';
import { CommonModule } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

@Component({
  selector: 'app-map-picker',
  imports: [CommonModule, FontAwesomeModule],
  templateUrl: './map-picker.component.html',
})
export class MapPickerComponent {
  @Input() lat?: number;
  @Input() lng?: number;

  icons = Icons;
}
