import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { importLibrary, setOptions } from '@googlemaps/js-api-loader';

@Injectable({
  providedIn: 'root',
})
export class LocationService {
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
