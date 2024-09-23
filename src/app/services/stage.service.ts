import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { AuthService } from './auth.service';
import { apiGenericModel } from '../model/Generic';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class StageService {
  private apiURL = `${environment.apiUrl}stage/`;
  constructor(private http: HttpClient) {}
  authService = inject(AuthService);

  /**
   * Get all Stages
   * @returns response
   */
  getAllStages(): Observable<apiGenericModel> {
    return this.http.get<apiGenericModel>(this.apiURL + 'getAll');
  }

  /**
   * This method for update Stage
   * @param id Stage ID
   * @param name Stage name
   * @returns response
   */
  updateStage(id: number, name: string): Observable<apiGenericModel> {
    return this.http.put<apiGenericModel>(this.apiURL + id, {
      name,
      userid: this.authService.getUserID(),
    });
  }

  /**
   * This method use for create Stage
   * @param name Stage name
   * @returns response
   */
  createStage(name: string): Observable<apiGenericModel> {
    return this.http.post<apiGenericModel>(this.apiURL + 'create', {
      name,
      userid: this.authService.getUserID(),
    });
  }
}
