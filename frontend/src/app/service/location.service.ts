import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { map, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class LocationService {
  private http = inject(HttpClient);
  private API_KEY = environment.google.apiKey;

  reverseGeocode(lat: number, lng: number): Observable<string> {
    const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${this.API_KEY}`;

    return this.http.get<any>(url).pipe(
      map((response) => {
        if (response.status === 'OK' && response.results.length > 0) {
          return response.results[0].formatted_address;
        }
        throw new Error('Address not found');
      })
    );
  }
}
