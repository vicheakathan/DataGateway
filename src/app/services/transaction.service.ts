import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { EventEmitter, Injectable, Output } from '@angular/core';
import { SortDirection } from '@angular/material/sort';
import { catchError, Observable, throwError } from 'rxjs';
import { environment } from 'src/environments/environment.prod';
import { TokenService } from './token.service';
import { TransactionModel } from 'src/app/models/transaction';

const API_URL = environment.api_url;
@Injectable({
  providedIn: 'root'
})
export class TransactionService {
  constructor(
    private _http: HttpClient, 
    private _tokenService: TokenService,
  ) { }

  public HTTP_OPTIONS = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + this._tokenService.getToken(),
      'Cache-Control': 'no-cache'
    })
  };

  private static handleError(error: HttpErrorResponse): any {
    if (error.error instanceof ErrorEvent) {
      console.error('An error occurred:', error.error.message);
    } else {
      console.error(
        'Backend returned code ' + error.status,
        'body was: ' + error.error);
    }
    return throwError(
      'Something bad happened; please try again later.');
  }

  getTaskManagerTransation(): Observable<any> {
    return this._http.get<any>(API_URL + 'api/taskmanager', this.HTTP_OPTIONS)
      .pipe(catchError(TransactionService.handleError));
  }

  getTransaction(itemsPerPage: number, currentPage: number, orderByDate: string, startDate: string, endDate: string) {
    var dateFilter = "";
    if (startDate && endDate != null) {
      dateFilter = "&startDate=" + startDate + "&endDate=" + endDate;
    }

    const param = "?itemsPerPage=" + itemsPerPage + "&currentPage=" + currentPage + "&orderByDate=" + orderByDate + dateFilter;
    
    return this._http.get<any>(API_URL + 'api/taskmanager' + param, this.HTTP_OPTIONS)
      .toPromise()
      .then(response => {return response;});
  }

  getErrorLog(): Observable<any> {
    return this._http.get<any>(API_URL + 'api/taskmanager/getErrorLog', this.HTTP_OPTIONS)
      .pipe(catchError(TransactionService.handleError));
  }
  getTaskSaleTransaction(itemsPerPage: number, currentPage: number, orderByDate: string, startDate: string, endDate: string, status: string) {
    var dateFilter = "";
    if (startDate && endDate != null) {
      dateFilter = "&startDate=" + startDate + "&endDate=" + endDate;
    }

    const param = "?itemsPerPage=" + itemsPerPage + "&currentPage=" + currentPage + "&orderByDate=" + orderByDate + "&status=" + status + dateFilter;
    
    return this._http.get<any>(API_URL + 'api/taskmanager/getTaskSaleTransaction' + param, this.HTTP_OPTIONS)
      .toPromise()
      .then(response => {return response;});
  }
}
