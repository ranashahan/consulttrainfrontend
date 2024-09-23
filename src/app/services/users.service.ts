import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { apiUserModel } from '../model/User';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class UsersService {
  private apiURL = `${environment.apiUrl}users/`;
  constructor(private http: HttpClient) {}

  getAllUsers(): Observable<apiUserModel> {
    return this.http.get<apiUserModel>(this.apiURL + 'getusers');
  }

  getUserByID(id: string): Observable<apiUserModel> {
    return this.http.get<apiUserModel>(this.apiURL + `${id}`);
  }

  updateUserByID(
    id: string,
    name: string,
    mobile: string,
    company: string,
    designation: string,
    role: string
  ): Observable<apiUserModel> {
    return this.http.put<apiUserModel>(this.apiURL + id, {
      name,
      mobile,
      company,
      designation,
      role,
    });
  }

  createUser(
    username: any,
    email: any,
    password: any,
    name: any,
    mobile: any,
    profilepic: any,
    company: any,
    designation: any,
    role: any
  ): Observable<apiUserModel> {
    return this.http.post<apiUserModel>(this.apiURL + 'register', {
      username,
      email,
      password,
      name,
      mobile,
      profilepic,
      company,
      designation,
      role: role,
    });
  }
}
