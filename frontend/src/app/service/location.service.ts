import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { importLibrary, setOptions } from '@googlemaps/js-api-loader';

@Injectable({
  providedIn: 'root',
})
export class LocationService {
  private http = inject(HttpClient);
  private API_KEY = environment.google.apiKey;

  constructor() {
    setOptions({
      key: this.API_KEY,
      v: 'weekly',
    });
  }

  async getMapsLibrary() {
    return (await importLibrary('maps')) as google.maps.MapsLibrary;
  }

  async getPlacesLibrary() {
    return (await importLibrary('places')) as google.maps.PlacesLibrary;
  }

  async getGeocodingLibrary() {
    return (await importLibrary('geocoding')) as google.maps.GeocodingLibrary;
  }
}
