import { Component, ElementRef, inject, Input, ViewChild } from '@angular/core';
import { Icons } from '../../../utils/icons';
import { CommonModule } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { LocationService } from '../../../service/location.service';

@Component({
  selector: 'app-map-picker',
  imports: [CommonModule, FontAwesomeModule],
  templateUrl: './map-picker.component.html',
})
export class MapPickerComponent {
  @Input() lat!: number;
  @Input() lng!: number;

  icons = Icons;

  @ViewChild('mapContainer', { static: true })
  mapContainer!: ElementRef<HTMLDivElement>;

  private locationService = inject(LocationService);

  map!: google.maps.Map;

  async ngAfterViewInit() {
    const { Map } = (await google.maps.importLibrary(
      'maps',
    )) as google.maps.MapsLibrary;

    this.map = new Map(this.mapContainer.nativeElement, {
      center: { lat: this.lat, lng: this.lng },
      zoom: 16,
      disableDefaultUI: true,
      gestureHandling: 'greedy',
    });
  }
}
