import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { catchError, map, Observable, throwError } from 'rxjs';
import { HttpClient, HttpParams, HttpResponse } from '@angular/common/http';
import { AuthService } from './auth.service';
import {
  apiAssessmentFormModel,
  apiAssessmentModel,
} from '../model/Assessment';

@Injectable({
  providedIn: 'root',
})
export class AssessmentService {
  private readonly apiURL = `${environment.apiUrl}assessment/`;
  authService = inject(AuthService);
  constructor(private http: HttpClient) {}

  /**
   * Get all assessments
   * @returns response
   */
  getAllAssessments(): Observable<any> {
    return this.http.get(this.apiURL + 'getAll');
  }

  getSessionbydate(
    nic?: any,
    name?: any,
    sessiondate?: any,
    contractorid?: any,
    resultid?: any,
    stageid?: any,
    locationid?: any,
    startDate?: string,
    endDate?: string
  ): Observable<any> {
    let params = new HttpParams();
    if (nic) {
      params = params.set('nic', nic);
    }
    if (name) {
      params = params.set('name', name);
    }
    if (sessiondate) {
      params = params.set('sessiondate', sessiondate);
    }
    if (contractorid) {
      params = params.set('contractorid', contractorid);
    }
    if (resultid) {
      params = params.set('resultid', resultid);
    }
    if (stageid) {
      params = params.set('stageid', stageid);
    }
    if (locationid) {
      params = params.set('locationid', locationid);
    }
    if (startDate) {
      params = params.set('startDate', startDate);
    }
    if (endDate) {
      params = params.set('endDate', endDate);
    }
    return this.http.get(this.apiURL + 'getbydate', { params });
  }

  getSessionbyID(id: number) {
    return this.http.get(this.apiURL + id);
  }

  /**
   * This method will create assessment form with driver and trainer information
   * @param driverId Driver ID
   * @param obj Complete form object with assessment scores
   * @returns response
   */
  createAssessment(
    driverId: number,
    obj: apiAssessmentFormModel
  ): Observable<apiAssessmentFormModel> {
    var answerCategories = obj.categories;
    var answerSessionDate = obj.sessionDate;

    const jsonResult = this.convertCategoriesToJson(
      answerCategories,
      answerSessionDate
    );
    // Convert to JSON string if needed
    //const jsonString = JSON.stringify(jsonResult, null, 2);
    obj.totalScore = jsonResult.totalScore;
    obj.assessmentData = jsonResult.data;
    obj.trainerIds = obj.trainer.join(',');

    return this.http
      .post<apiAssessmentFormModel>(
        this.apiURL + 'create',
        {
          driverId,
          obj,
          userid: this.authService.getUserID(),
        },
        { observe: 'response' }
      )
      .pipe(
        map((response: HttpResponse<any>) => {
          // console.log(`Status: ${response.status}`); // Access status code
          return response.body; // Return response body
        }),
        catchError((error) => {
          // console.log('Full error response:', error); // Log the full error object

          // Extract the message from the error object.
          let errorMessage = 'An unknown error occurred'; // Fallback message

          // Check if the error has a response body with a message.
          if (error.error && typeof error.error === 'object') {
            if (error.error.message) {
              errorMessage = error.error.message; // Check if error message exists in the error object
            } else if (error.message) {
              errorMessage = error.message; // Use general error message if available
            }
          } else if (error.message) {
            errorMessage = error.message; // Use the top-level error message if no nested error object
          }

          return throwError(() => new Error(errorMessage)); // Pass the correct error message
        })
      );
  }

  private convertCategoriesToJson(
    categories: any[],
    sessionDate: string
  ): { data: any[]; totalScore: number } {
    const result: any[] = [];
    let totalScore = 0;
    categories.forEach((category) => {
      category.assessments.forEach((assessment: apiAssessmentModel) => {
        if (assessment.scoreInitial != null) {
          result.push({
            slavecategoryid: category.id,
            activityid: assessment.id,
            assessmenttype: 'Initial',
            score: assessment.scoreInitial,
            assessmentdate: sessionDate,
          });
          totalScore += assessment.scoreInitial;
        }

        if (assessment.scoreMiddle != null) {
          result.push({
            slavecategoryid: category.id,
            activityid: assessment.id,
            assessmenttype: 'Middle',
            score: assessment.scoreMiddle,
            assessmentdate: sessionDate,
          });
          totalScore += assessment.scoreMiddle;
        }

        if (assessment.scoreFinal != null) {
          result.push({
            slavecategoryid: category.id,
            activityid: assessment.id,
            assessmenttype: 'Final',
            score: assessment.scoreFinal,
            assessmentdate: sessionDate,
          });
          totalScore += assessment.scoreFinal;
        }
      });
    });

    return { data: result, totalScore };
  }
}
