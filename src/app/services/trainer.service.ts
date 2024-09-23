import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { Observable } from 'rxjs';
import { apiTrainerModel } from '../model/Trainer';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class TrainerService {
  private apiURL = `${environment.apiUrl}trainer/`;
  constructor(private http: HttpClient) {}
  authService = inject(AuthService);

  getAllTrainers(): Observable<apiTrainerModel> {
    return this.http.get<apiTrainerModel>(this.apiURL + 'getAll');
  }

  updateTrainer(
    id: number,
    name: string,
    initials: string,
    mobile: string,
    address: string
  ): Observable<apiTrainerModel> {
    return this.http.put<apiTrainerModel>(this.apiURL + id, {
      name,
      initials,
      mobile,
      address,
      userid: this.authService.getUserID(),
    });
  }

  createTrainer(
    name: string,
    initials: string,
    mobile: string,
    address: string
  ): Observable<apiTrainerModel> {
    return this.http.post<apiTrainerModel>(this.apiURL + 'create', {
      name,
      initials,
      mobile,
      address,
      userid: this.authService.getUserID(),
    });
  }
}
