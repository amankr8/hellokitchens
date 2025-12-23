import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MenuItem } from '../model/menu';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class MenuService {
  private apiUrl = 'http://localhost:8080/api/v1/menus'; // Adjust to your backend URL

  constructor(private http: HttpClient) {}

  getMenuItems(subdomain: string): Observable<MenuItem[]> {
    return this.http.get<MenuItem[]>(this.apiUrl + `/${subdomain}`);
  }
}
