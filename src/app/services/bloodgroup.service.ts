import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';
import { environment } from '../../environments/environment';
import { apiGenericModel } from '../model/Generic';

@Injectable({
  providedIn: 'root',
})
export class BloodgroupService {
  private apiURL = `${environment.apiUrl}bloodgroup/`;
  constructor(private http: HttpClient) {}
  authService = inject(AuthService);

  getAllBloodgroups(): Observable<apiGenericModel> {
    return this.http.get<apiGenericModel>(this.apiURL + 'getAll');
  }

  updateBloodGroup(id: number, name: string): Observable<apiGenericModel> {
    return this.http.put<apiGenericModel>(this.apiURL + id, {
      name,
      userid: this.authService.getUserID(),
    });
  }

  createBloodGroup(name: string): Observable<apiGenericModel> {
    return this.http.post<apiGenericModel>(this.apiURL + 'create', {
      name,
      userid: this.authService.getUserID(),
    });
  }
}
