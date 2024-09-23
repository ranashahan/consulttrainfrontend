import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { apiGenericModel } from '../model/Generic';

@Injectable({
  providedIn: 'root',
})
export class DltypeService {
  private apiURL = `${environment.apiUrl}dltype/`;
  constructor(private http: HttpClient) {}
  authService = inject(AuthService);

  /**
   * Get all Driver license types
   * @returns response
   */
  getAllDLTypes(): Observable<apiGenericModel> {
    return this.http.get<apiGenericModel>(this.apiURL + 'getAll');
  }

  /**
   * This method for update driver license types
   * @param id Driver license type ID
   * @param type Driver license type
   * @returns response
   */
  updateDLTypes(id: number, type: string): Observable<apiGenericModel> {
    return this.http.put<apiGenericModel>(this.apiURL + id, {
      type,
      userid: this.authService.getUserID(),
    });
  }

  /**
   * This method use for create Driver license type
   * @param type Driver license type
   * @returns response
   */
  createDLTypes(type: string): Observable<apiGenericModel> {
    return this.http.post<apiGenericModel>(this.apiURL + 'create', {
      type,
      userid: this.authService.getUserID(),
    });
  }
}
