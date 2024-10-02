import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { apiUserModel } from '../model/User';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class UsersService {
  private readonly apiURL = `${environment.apiUrl}users/`;
  constructor(private http: HttpClient) {}

  getAllUsers(): Observable<apiUserModel> {
    return this.http.get<apiUserModel>(this.apiURL + 'getusers');
  }

  getUserByID(id: string): Observable<apiUserModel> {
    return this.http.get<apiUserModel>(this.apiURL + `${id}`);
  }

  updateUserByID(
    id: number,
    name: string,
    mobile: string,
    company: string,
    designation: string,
    imagepath: string,
    role: string
  ): Observable<apiUserModel> {
    return this.http.put<apiUserModel>(this.apiURL + id, {
      name,
      mobile,
      company,
      designation,
      imagepath,
      role,
    });
  }

  createUser(obj: apiUserModel): Observable<apiUserModel> {
    console.log(obj);
    return this.http.post<apiUserModel>(this.apiURL + 'register', {
      obj,
    });
  }
}
