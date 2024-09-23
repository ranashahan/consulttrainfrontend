import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { AuthService } from './auth.service';
import { Observable } from 'rxjs';
import { apiGenericModel } from '../model/Generic';

@Injectable({
  providedIn: 'root',
})
export class TitleService {
  private apiURL = `${environment.apiUrl}title/`;
  constructor(private http: HttpClient) {}
  authService = inject(AuthService);

  /**
   * Get all Titles
   * @returns response
   */
  getAllTitles(): Observable<apiGenericModel> {
    return this.http.get<apiGenericModel>(this.apiURL + 'getAll');
  }

  /**
   * This method for update Title
   * @param id Title ID
   * @param name Title name
   * @returns response
   */
  updateTitle(id: number, name: string): Observable<apiGenericModel> {
    return this.http.put<apiGenericModel>(this.apiURL + id, {
      name,
      userid: this.authService.getUserID(),
    });
  }

  /**
   * This method use for create Title
   * @param name Title name
   * @returns response
   */
  createTitle(name: string): Observable<apiGenericModel> {
    return this.http.post<apiGenericModel>(this.apiURL + 'create', {
      name,
      userid: this.authService.getUserID(),
    });
  }
}
