import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { AuthService } from './auth.service';
import { BehaviorSubject, Observable } from 'rxjs';
import { apiActivityModel } from '../model/Activity';
import {
  apiMasterCategoryModel,
  apiSlaveCategoryModel,
} from '../model/Category';

@Injectable({
  providedIn: 'root',
})
export class ActivityService {
  private readonly apiURL = `${environment.apiUrl}activity/`;
  private readonly apiMasterURL = `${environment.apiUrl}activity/master/`;
  private readonly apiSlaveURL = `${environment.apiUrl}activity/slave/`;

  private selectedCategoryId: BehaviorSubject<number> =
    new BehaviorSubject<number>(0);
  selectedCategoryId$: Observable<number> =
    this.selectedCategoryId.asObservable();

  constructor(private http: HttpClient) {}
  authService = inject(AuthService);

  /**
   * Get all activities
   * @returns response
   */
  getAllActivities(): Observable<apiActivityModel> {
    return this.http.get<apiActivityModel>(this.apiURL + 'getAll');
  }

  /**
   * Get all activities
   * @returns response
   */
  getAllSlaveCategories(): Observable<apiActivityModel> {
    return this.http.get<apiActivityModel>(this.apiURL + 'slave/getAll');
  }

  /**
   * This method will fetch all the activity which contain scondary id
   * @param id scondary category id
   * @returns response
   */
  getActivityBySlaveID(id: number) {
    return this.http.get<apiActivityModel>(this.apiURL + 'getbyslave/' + id);
  }

  /**
   * This method for update activity
   * @param id Activity ID
   * @param name name
   * @param description description
   * @param initials initials
   * @param slavecategoryid scondarycategory ID
   * @returns
   */
  updateActivity(
    id: number,
    name: string,
    description: string,
    initials: string,
    slavecategoryid: number
  ): Observable<apiActivityModel> {
    return this.http.put<apiActivityModel>(this.apiURL + id, {
      name,
      description,
      initials,
      slavecategoryid,
      userid: this.authService.getUserID(),
    });
  }

  /**
   * This method use for create activity
   * @param name name
   * @param description description
   * @param initials initials
   * @param slavecategoryid scondary category id
   * @returns
   */
  createActivity(
    name: string,
    description: string,
    initials: string,
    slavecategoryid: number
  ): Observable<apiActivityModel> {
    return this.http.post<apiActivityModel>(this.apiURL + 'create', {
      name,
      description,
      initials,
      slavecategoryid,
      userid: this.authService.getUserID(),
    });
  }

  getMasterCategoriesAll(): Observable<apiMasterCategoryModel> {
    return this.http.get<apiMasterCategoryModel>(this.apiMasterURL + 'getAll');
  }

  updateMasterCategory(
    id: number,
    name: string,
    description: string
  ): Observable<apiMasterCategoryModel> {
    return this.http.put<apiMasterCategoryModel>(this.apiMasterURL + id, {
      name,
      description,
      userid: this.authService.getUserID(),
    });
  }

  createMasterCategory(
    name: string,
    description: string
  ): Observable<apiMasterCategoryModel> {
    return this.http.post<apiMasterCategoryModel>(
      this.apiMasterURL + 'create',
      {
        name,
        description,
        userid: this.authService.getUserID(),
      }
    );
  }

  getSlaveCategoriesAll(): Observable<apiSlaveCategoryModel> {
    return this.http.get<apiSlaveCategoryModel>(this.apiSlaveURL + 'getAll');
  }

  updateSlaveCategory(
    id: number,
    name: string,
    description: string,
    initials: string,
    mastercategoryid: number
  ): Observable<apiSlaveCategoryModel> {
    return this.http.put<apiSlaveCategoryModel>(this.apiSlaveURL + id, {
      name,
      description,
      initials,
      mastercategoryid,
      userid: this.authService.getUserID(),
    });
  }

  createSlaveCategory(
    name: string,
    description: string,
    initials: string,
    mastercategoryid: number
  ): Observable<apiSlaveCategoryModel> {
    return this.http.post<apiSlaveCategoryModel>(this.apiSlaveURL + 'create', {
      name,
      description,
      initials,
      mastercategoryid,
      userid: this.authService.getUserID(),
    });
  }
}
