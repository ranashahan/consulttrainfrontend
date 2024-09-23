import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { AuthService } from './auth.service';
import { Observable } from 'rxjs';
import { apiGenericModel } from '../model/Generic';

@Injectable({
  providedIn: 'root',
})
export class VisualService {
  private apiURL = `${environment.apiUrl}visual/`;
  constructor(private http: HttpClient) {}
  authService = inject(AuthService);

  /**
   * Get all Visuals
   * @returns response
   */
  getAllVisuals(): Observable<apiGenericModel> {
    return this.http.get<apiGenericModel>(this.apiURL + 'getAll');
  }

  /**
   * This method for update Visual
   * @param id Visual ID
   * @param name Visual name
   * @returns response
   */
  updateVisual(id: number, name: string): Observable<apiGenericModel> {
    return this.http.put<apiGenericModel>(this.apiURL + id, {
      name,
      userid: this.authService.getUserID(),
    });
  }

  /**
   * This method use for create Visual
   * @param name Visual name
   * @returns response
   */
  createVisual(name: string): Observable<apiGenericModel> {
    return this.http.post<apiGenericModel>(this.apiURL + 'create', {
      name,
      userid: this.authService.getUserID(),
    });
  }
}
