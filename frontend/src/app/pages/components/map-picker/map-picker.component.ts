import {
  Component,
  ElementRef,
  EventEmitter,
  inject,
  Input,
  Output,
  ViewChild,
} from '@angular/core';
import { Icons } from '../../../utils/icons';
import { CommonModule } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { LocationService } from '../../../service/location.service';
import { UiService } from '../../../service/ui.service';

@Component({
  selector: 'app-map-picker',
  imports: [CommonModule, FontAwesomeModule],
  templateUrl: './map-picker.component.html',
})
export class MapPickerComponent {
  @Input() lat!: number;
  @Input() lng!: number;

  @Output() locationChange = new EventEmitter<{
    lat: number;
    lng: number;
  }>();

  @Output() locating = new EventEmitter<boolean>();

  icons = Icons;

  @ViewChild('mapContainer', { static: true })
  mapContainer!: ElementRef<HTMLDivElement>;

  private locationService = inject(LocationService);
  private uiService = inject(UiService);

  map!: google.maps.Map;

  async ngAfterViewInit() {
    const { Map } = await this.locationService.getMapsLibrary();

    this.map = new Map(this.mapContainer.nativeElement, {
      center: { lat: this.lat, lng: this.lng },
      zoom: 16,
      disableDefaultUI: true,
      gestureHandling: 'greedy',
    });

    this.map.addListener('idle', () => {
      const center = this.map.getCenter();
      if (!center) return;

      this.locationChange.emit({
        lat: center.lat(),
        lng: center.lng(),
      });
    });
  }

  locateMe() {
    if (!navigator.geolocation) {
      this.uiService.showToast('Geolocation not supported', 'error');
      return;
    }

    this.locating.emit(true);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;

        this.map.panTo({ lat: latitude, lng: longitude });

        this.locationChange.emit({
          lat: latitude,
          lng: longitude,
        });

        this.locating.emit(false);
      },
      (error) => {
        this.locating.emit(false);
        this.uiService.showToast(
          'Please allow location access in browser settings',
          'error',
        );
      },
    );
  }
}
