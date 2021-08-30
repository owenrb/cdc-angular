import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { DateRange } from '../model/DateRange';


const reducer = (map:Map<string, string[]>, currentValue:string) => {

  var arr = currentValue.split('.');
  var key = arr[0];
  var value = arr[1];

  if(!map.has(key)) {
    map.set(key, [value]);
  } else {
    map.get(key)?.push(value);
  }

  return map;
}

@Injectable({
  providedIn: 'root'
})
export class SharedService {

  // Observable string sources
  private selectedTableSource = new Subject<string>();
  private selectedColumnSource = new Subject<Map<string, string[]>>();
  private dateRangeSource = new Subject<DateRange>();

  // Observable string streams
  selectedTables$ = this.selectedTableSource.asObservable();
  selectedColumns$ = this.selectedColumnSource.asObservable();
  dateRange$ =this.dateRangeSource.asObservable();

  constructor() { }

  // Service message commands
  selectTables(tables: string) {
    this.selectedTableSource.next(tables);
  }

  selectColumns(columns: string) {

    console.log('columns: ' + columns)
    var map = new Map();

    var arr = columns.split(',');
    var filter = arr.reduce(reducer, map);
  
    this.selectedColumnSource.next(filter);
  }

  setDateRange(dateRange: DateRange) {
    this.dateRangeSource.next(dateRange);
  }
}
