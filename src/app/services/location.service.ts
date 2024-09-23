import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { AuthService } from './auth.service';
import { Observable } from 'rxjs';
import { apiGenericModel } from '../model/Generic';

@Injectable({
  providedIn: 'root',
})
export class LocationService {
  private apiURL = `${environment.apiUrl}location/`;
  constructor(private http: HttpClient) {}
  authService = inject(AuthService);

  /**
   * Get all Locations
   * @returns response
   */
  getAllLocations(): Observable<apiGenericModel> {
    return this.http.get<apiGenericModel>(this.apiURL + 'getAll');
  }

  /**
   * This method for update location
   * @param id Location ID
   * @param name Location name
   * @returns response
   */
  updateLocation(id: number, name: string): Observable<apiGenericModel> {
    return this.http.put<apiGenericModel>(this.apiURL + id, {
      name,
      userid: this.authService.getUserID(),
    });
  }

  /**
   * This method use for create location
   * @param name Location name
   * @returns response
   */
  createLocation(name: string): Observable<apiGenericModel> {
    return this.http.post<apiGenericModel>(this.apiURL + 'create', {
      name,
      userid: this.authService.getUserID(),
    });
  }
}
