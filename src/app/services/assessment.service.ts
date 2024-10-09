import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class AssessmentService {
  private readonly apiURL = `${environment.apiUrl}assessment/`;
  constructor(private http: HttpClient) {}

  /**
   * Get all assessments
   * @returns response
   */
  getAllAssessments(): Observable<any> {
    return this.http.get(this.apiURL + 'getAll');
  }
}
