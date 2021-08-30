import { DatePipe } from '@angular/common';
import { Component, Input, OnInit, Output, Pipe, PipeTransform, EventEmitter } from '@angular/core';
import { DxoDataPrepareSettingsModule } from 'devextreme-angular/ui/nested';
import { CdcSummary } from '../model/CdcSummary';
import { HttpClientService } from '../service/http-client.service';
import { SharedService } from '../service/shared.service';

@Component({
  selector: 'app-summary',
  templateUrl: './summary.component.html',
  styleUrls: ['./summary.component.css']
})
export class SummaryComponent implements OnInit {

  dataSource: any = []
  selectedRows: number[] = [];

  constructor(private datePipe: DatePipe, private httpClientService: HttpClientService, private sharedService: SharedService) { 
    
    var baseDate = this.datePipe.transform(new Date(), "yyyy-MM-dd");
    if(baseDate)
      this.fetch(baseDate, baseDate);
  }

  ngOnInit(): void {
    this.sharedService.dateRange$.subscribe(dateRange => {
      var f = this.datePipe.transform(dateRange.from, "yyyy-MM-dd");
      var t = this.datePipe.transform(dateRange.to, "yyyy-MM-dd");

      if(f && t) {
        this.fetch(f, t);
      }
    })
  }

  fetch(startDay: string, endDay: string) {
    this.httpClientService.getSummary(startDay, endDay).subscribe(data => this.dataSource = data)
  }

  

}

@Pipe({ name: 'stringifyTables' })
export class StringifyTablesPipe implements PipeTransform {
    transform(tables: CdcSummary[]) {
        return tables.map(table =>  table.table ).join(",");
    }
}

@Component({
  selector: 'app-summary-emitter',
  template: ``
})
export class SummaryEmitterComponent implements OnInit {
  

  constructor(private sharedService : SharedService) {

  }

  ngOnInit(): void {
  }

  @Input()
  set selectedTables(csv: string) {

    this.sharedService.selectTables(csv);
  }
}
