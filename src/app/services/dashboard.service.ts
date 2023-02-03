import { DOCUMENT } from '@angular/common';
import { HttpClient, HttpHeaders, HttpRequest, HttpEventType, HttpErrorResponse } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { catchError, Observable, tap, throwError } from 'rxjs';
import { LocalStorageService } from './localStorage.service';
import { TokenService } from './token.service';
import { environment } from 'src/environments/environment.prod';
const API_URL = environment.api_url;

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  uploadPercent: any;
  constructor(
    private http: HttpClient,
    private _tokenService: TokenService,
  ) {}

  public HTTP_OPTIONS = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + this._tokenService.getToken(),
      'Cache-Control': 'no-cache'
    })
  };

  public static handleError(error: HttpErrorResponse): any {
    if (error.error instanceof ErrorEvent) {
      console.error('An error occurred:', error.error.message);
    } else {
      console.error(
        'Backend returned code ' + error.status,
        'body was: ' + error.error);
    }
    return throwError(error.error);
  }

  dashboard(date: any) {
    var currentDate = "";
    if (date != null)
      currentDate = "?date=" + date;
    const param = currentDate;
    
    return this.http.get<any>(API_URL + 'api/dashboard' + param, this.HTTP_OPTIONS)
        .toPromise()
        .then(response => {return response;});
  }

  weather() {
    return this.http.get<any>(API_URL + 'api/dashboard/weather', this.HTTP_OPTIONS)
        .toPromise()
        .then(response => {return response;});
  }

  saleSummary() {
    return this.http.get<any>(API_URL + 'api/dashboard/salesummarybymonth', this.HTTP_OPTIONS)
        .toPromise()
        .then(response => {return response;});
  }
  
}
