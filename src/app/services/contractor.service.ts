import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { Observable } from 'rxjs';
import { apiContractorModel } from '../model/Contractor';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ContractorService {
  private apiURL = `${environment.apiUrl}contractor/`;
  constructor(private http: HttpClient) {}
  authService = inject(AuthService);

  /**
   * Get all contractors
   * @returns response
   */
  getAllContractors(): Observable<apiContractorModel> {
    return this.http.get<apiContractorModel>(this.apiURL + 'getAll');
  }

  getAssignedClients(id: number): Observable<any> {
    return this.http.get(environment.apiUrl + 'cc/' + id);
  }

  /**
   * Update contractor by id
   * @param id id
   * @param name name
   * @param contact contact
   * @param address address
   * @returns response
   */
  updateContractor(
    id: number,
    name: string,
    contact: string,
    address: string,
    initials: string
  ): Observable<apiContractorModel> {
    return this.http.put<apiContractorModel>(this.apiURL + id, {
      name,
      contact,
      address,
      initials,
      userid: this.authService.getUserID(),
    });
  }

  /**
   * Create contractor
   * @param name name
   * @param contact contact info
   * @param address address
   * @returns response
   */
  createContractor(
    name: string,
    contact: string,
    address: string,
    initials: string
  ): Observable<apiContractorModel> {
    return this.http.post<apiContractorModel>(this.apiURL + 'create', {
      name,
      contact,
      address,
      initials,
      userid: this.authService.getUserID(),
    });
  }
}
