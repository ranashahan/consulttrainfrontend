import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { AuthService } from './auth.service';
import { Observable } from 'rxjs';
import { apiGenericModel } from '../model/Generic';

@Injectable({
  providedIn: 'root',
})
export class ResultService {
  private apiURL = `${environment.apiUrl}result/`;
  constructor(private http: HttpClient) {}
  authService = inject(AuthService);

  /**
   * Get all Results
   * @returns response
   */
  getAllResults(): Observable<apiGenericModel> {
    return this.http.get<apiGenericModel>(this.apiURL + 'getAll');
  }

  /**
   * This method for update Result
   * @param id Result ID
   * @param name Result name
   * @returns response
   */
  updateResult(id: number, name: string): Observable<apiGenericModel> {
    return this.http.put<apiGenericModel>(this.apiURL + id, {
      name,
      userid: this.authService.getUserID(),
    });
  }

  /**
   * This method use for create Result
   * @param name Result name
   * @returns response
   */
  createResult(name: string): Observable<apiGenericModel> {
    return this.http.post<apiGenericModel>(this.apiURL + 'create', {
      name,
      userid: this.authService.getUserID(),
    });
  }
}
