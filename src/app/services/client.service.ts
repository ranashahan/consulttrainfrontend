import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { AuthService } from './auth.service';
import { Observable } from 'rxjs';
import { apiClientModel } from '../model/Client';

@Injectable({
  providedIn: 'root',
})
export class ClientService {
  private apiURL = `${environment.apiUrl}client/`;
  private apiURLCC = `${environment.apiUrl}cc/`;

  constructor(private http: HttpClient) {}
  authService = inject(AuthService);

  getAll(): Observable<apiClientModel> {
    return this.http.get<apiClientModel>(this.apiURL + 'getAll');
  }

  getByContractorID(id: number): Observable<any> {
    const url = `${this.apiURLCC}contractorid/${id}`;
    return this.http.get(url);
  }

  createClient(
    name: string,
    contactperson: string,
    contactnumber: string,
    address: string,
    website: string,
    agentname: string,
    agentnumber: string
  ): Observable<apiClientModel> {
    return this.http.post<apiClientModel>(this.apiURL + 'create', {
      name,
      contactperson,
      contactnumber,
      address,
      website,
      agentname,
      agentnumber,
      userid: this.authService.getUserID(),
    });
  }

  updateClient(
    name: string,
    contactperson: string,
    contactnumber: string,
    address: string,
    website: string,
    agentname: string,
    agentnumber: string,
    id: number
  ): Observable<apiClientModel> {
    return this.http.put<apiClientModel>(this.apiURL + id, {
      name,
      contactperson,
      contactnumber,
      address,
      website,
      agentname,
      agentnumber,
      userid: this.authService.getUserID(),
    });
  }
}
