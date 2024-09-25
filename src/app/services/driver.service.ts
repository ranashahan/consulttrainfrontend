import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import {
  HttpClient,
  HttpErrorResponse,
  HttpParams,
  HttpResponse,
} from '@angular/common/http';
import { AuthService } from './auth.service';
import { catchError, map, Observable, throwError } from 'rxjs';
import { apiDriverModel } from '../model/Driver';

@Injectable({
  providedIn: 'root',
})
export class DriverService {
  private apiURL = `${environment.apiUrl}driver/`;
  constructor(private http: HttpClient) {}
  authService = inject(AuthService);

  /**
   * Get all drivers
   * @returns response
   */
  getAllDrivers(): Observable<apiDriverModel> {
    return this.http.get<apiDriverModel>(this.apiURL + 'getAll');
  }

  getDriverByID(id: number) {
    return this.http.get<apiDriverModel>(this.apiURL + id);
  }

  deleteDriverByID(id: number) {
    return this.http.delete<apiDriverModel>(this.apiURL + id);
  }

  GetSearch(query: string) {
    return this.http.get<apiDriverModel>(`${this.apiURL}/search?nic=${query}`);
  }
  searchDrivers(
    nic?: any,
    licenseNumber?: any,
    name?: any,
    contractorid?: any,
    permitexpiry?: any,
    permitnumber?: any
  ): Observable<any> {
    let params = new HttpParams();

    // Add parameters only if they are provided (not undefined or empty)
    if (nic) {
      params = params.set('nic', nic);
    }
    if (licenseNumber) {
      params = params.set('licensenumber', licenseNumber);
    }
    if (name) {
      params = params.set('name', name);
    }
    if (contractorid) {
      params = params.set('contractorid', contractorid);
    }
    if (permitexpiry) {
      params = params.set('permitexpiry', permitexpiry);
    }
    if (permitnumber) {
      params = params.set('permitnumber', permitnumber);
    }
    console.log('what are my params: ' + params);
    // Make GET request with query parameters
    return this.http.get<any>(`${this.apiURL}/search`, { params });
  }
  GetAllDriverSearch(query: string) {
    return this.http.get<apiDriverModel>(`${this.apiURL}/search?${query}`);
  }

  /**
   * Update driver by id
   * @param id id
   * @param name name
   * @param contact contact
   * @param address address
   * @returns response
   */
  /**
   *
   * @param id id
   * @param name name
   * @param dob date of birth
   * @param nic nic
   * @param licensenumber license number
   * @param licensetypeid license type
   * @param licenseexpiry expiry
   * @param designation designation
   * @param department department
   * @param permitnumber permit number
   * @param permitissue permit issue date
   * @param permitexpiry permit expiry date
   * @param bloodgroupid blood group id
   * @param contractorid contractor id
   * @param ddccount ddc count number
   * @param experience existing driver experience
   * @returns
   */
  updatedriver(
    id: number,
    name: string,
    dob: string,
    nic: string,
    licensenumber: string,
    licensetypeid: number,
    licenseexpiry: Date,
    designation: string,
    department: string,
    permitnumber: string,
    permitissue: Date,
    permitexpiry: Date,
    bloodgroupid: number,
    contractorid: number,
    ddccount: number,
    experience: number
  ): Observable<apiDriverModel> {
    console.log('this is my id: ' + name);
    return this.http.put<apiDriverModel>(this.apiURL + id, {
      name,
      dob,
      nic,
      licensenumber,
      licensetypeid,
      licenseexpiry,
      designation,
      department,
      permitnumber,
      permitissue,
      permitexpiry,
      bloodgroupid,
      contractorid,
      ddccount,
      experience,
      userid: this.authService.getUserID(),
    });
  }

  /**
   * Create Driver
   * @param name name
   * @param dob date of birth
   * @param nic nic
   * @param licensenumber license number
   * @param licensetypeid license type
   * @param licenseexpiry expiry
   * @param designation designation
   * @param department department
   * @param permitnumber permit number
   * @param permitissue permit issue date
   * @param permitexpiry permit expiry date
   * @param bloodgroupid blood group id
   * @param contractorid contractor id
   * @param ddccount ddc count number
   * @param experience existing driver experience
   * @returns response
   */
  createDriver(
    name: string,
    dob: string,
    nic: string,
    licensenumber: string,
    licensetypeid: number,
    licenseexpiry: Date,
    designation: string,
    department: string,
    permitnumber: string,
    permitissue: Date,
    bloodgroupid: number,
    contractorid: number,
    ddccount: number,
    experience: number
  ): Observable<apiDriverModel> {
    return this.http
      .post<apiDriverModel>(
        this.apiURL + 'create',
        {
          name,
          dob,
          nic,
          licensenumber,
          licensetypeid,
          licenseexpiry,
          designation,
          department,
          permitnumber,
          permitissue,
          bloodgroupid,
          contractorid,
          ddccount,
          experience,
          userid: this.authService.getUserID(),
        },
        { observe: 'response' }
      )
      .pipe(
        map((response: HttpResponse<any>) => {
          console.log(`Status: ${response.status}`); // Access status code
          return response.body; // Return response body
        }),
        catchError(this.handleError)
      );
  }

  // Handle errors in the service
  private handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      // Client-side or network error
      console.error('A client-side error occurred:', error.error.message);
    } else {
      // Backend error (e.g., wrong API, failed request)
      console.error(
        `Backend returned code ${error.status}, body was: ${error.error}`
      );
    }
    // Return a readable error message
    return throwError(
      () => new Error('Something went wrong; please try again later.')
    );
  }
}
