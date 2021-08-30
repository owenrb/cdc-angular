import { Component, OnInit, Pipe, PipeTransform, Input } from '@angular/core';
import { CapturedColumn } from '../model/CapturedColumn';
import { HttpClientService } from '../service/http-client.service';
import { SharedService } from '../service/shared.service';

@Component({
  selector: 'app-captured-columns',
  templateUrl: './captured-columns.component.html',
  styleUrls: ['./captured-columns.component.css']
})
export class CapturedColumnsComponent implements OnInit {

  selectedTables : CapturedColumn[] = []
  allTables : CapturedColumn[] = []

  constructor( private httpClientService: HttpClientService, private sharedService: SharedService) {
    this.fetch()

    this.sharedService.selectedTables$.subscribe(selected => {

      if(selected == '') {
        this.selectedTables = [];
      } else {

        const arr = selected.split(",");
        this.selectedTables = this.allTables.filter(entry => arr.includes(entry.table_name));
      }

    });
   }

  ngOnInit(): void {
  }

  fetch() {
    this.httpClientService.getCapturedColumns().subscribe(data => this.allTables = data);
  }

}


@Pipe({ name: 'stringifyColumns' })
export class StringifyColumnsPipe implements PipeTransform {
    transform(tables: CapturedColumn[]) {
        return tables.map(cc =>  cc.table_name + "." + cc.column_name ).join(",");
    }
}


@Component({
  selector: 'app-column-emitter',
  template: ``
})
export class ColumnEmitterComponent implements OnInit {
  

  constructor(private sharedService : SharedService) {

  }

  ngOnInit(): void {
  }

  @Input()
  set selectedColumns(csv: string) {

    this.sharedService.selectColumns(csv);
  }
}