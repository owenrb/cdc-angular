import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CdcSummary } from '../model/CdcSummary';
import { CapturedColumn } from '../model/CapturedColumn';


const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type':  'application/json',
    'Authorization': 'Basic ' + btoa("sysadmin:2")
  })
};

const maxRow = 10000

@Injectable({
  providedIn: 'root'
})
export class HttpClientService {

  constructor(private httpClient:HttpClient) { }

  getMaxRow() {
    return maxRow;
  }

  
  getSummary(startDay: string, endDay: string) {
		return this.httpClient.get<CdcSummary>('/api/cdc/search?startDay=' + startDay + '&endDay=' + endDay, httpOptions)
	}
  
  getCapturedColumns() {
    return this.httpClient.get<CapturedColumn[]>('/api/cdc/columns', httpOptions);
  }

  getChangeDetails(table: string, columns: string, startDay: string, endDay: string) {
    return this.httpClient.get<any[]>('/api/cdc/search/' + table + '?startDay=' + startDay + '&endDay=' + endDay + '&columns=' + columns + '&maxRow=' + maxRow , httpOptions);
  }
}
