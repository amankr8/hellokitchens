import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class KitchenService {
  private apiUrl = environment.apiBaseUrl + '/api/v1/kitchens';
  constructor(private http: HttpClient) {}

  getKitchen() {
    return this.http.get(this.apiUrl);
  }
}
