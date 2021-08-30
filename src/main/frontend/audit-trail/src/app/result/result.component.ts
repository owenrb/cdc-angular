import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ColumnFilter } from '../model/ColumnFilter';
import { SharedService } from '../service/shared.service';

@Component({
  selector: 'app-result',
  templateUrl: './result.component.html',
  styleUrls: ['./result.component.css']
})
export class ResultComponent implements OnInit {

  tables:ColumnFilter[] = []
  selectedFilter: Map<string, string[]> = new Map();

  startDay; endDay;

  constructor(private datePipe: DatePipe, private sharedService: SharedService) { 
    sharedService.selectedColumns$.subscribe(filter => this.selectedFilter = filter)

    var baseDate = this.datePipe.transform(new Date(), "yyyy-MM-dd");
    if(baseDate) {
      this.startDay = this.endDay = baseDate;
    }
  }

  ngOnInit(): void {
    this.sharedService.dateRange$.subscribe(dateRange => {

      var f = this.datePipe.transform(dateRange.from, "yyyy-MM-dd");
      if(f) {
        this.startDay = f;
      }
      var t = this.datePipe.transform(dateRange.to, "yyyy-MM-dd");
      if(t) {
        this.endDay = t;
      }
    })
  }

  apply() {
    var keys = Array.from(this.selectedFilter.keys());

    // clear
    this.tables = [];

    keys.forEach((value, idx) => {
      var table = new ColumnFilter();
      table.table = value;
      var arr = this.selectedFilter.get(value);
      if(arr) {
        table.columns = arr;
      }
      this.tables.push(table);
    });

    console.log(this.tables);
  }

}
