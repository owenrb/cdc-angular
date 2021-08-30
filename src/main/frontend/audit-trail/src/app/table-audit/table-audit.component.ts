import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { BreakPointRegistry } from '@angular/flex-layout';
import { DxDataGridComponent } from 'devextreme-angular';
import { HttpClientService } from '../service/http-client.service';

@Component({
  selector: 'app-table-audit',
  templateUrl: './table-audit.component.html',
  styleUrls: ['./table-audit.component.css']
})
export class TableAuditComponent implements OnInit {

  @ViewChild(DxDataGridComponent, { static: false }) dataGrid: DxDataGridComponent | undefined;

  @Input()
  table = '';

  @Input()
  columns = '';

  @Input()
  startDay = ''

  @Input()
  endDay = ''

  groups: string[] = []

  datasource: any[] = []

  isVisible: boolean = false;
  maxRow: number;

  filter: Array<any> = []
  filterFields: Array<any> = []

  constructor(private httpClient: HttpClientService) {
    this.maxRow = this.httpClient.getMaxRow();
   }

  ngOnInit(): void {
    
    this.httpClient.getChangeDetails(this.table, this.columns, this.startDay, this.endDay).subscribe(result => {
      this.datasource = result

      var len = result.length
    
      if(len > 0) {
        var sample = result[0];

        this.groups = Object.keys(sample)
        console.log('sample: ' + JSON.stringify(this.groups));

        this.filterFields = []
        this.groups.forEach((v, i) => {
          this.filterFields.push( {
            dataField: v,
            dataType: "string"
          })
        });
      

      }

      if(result.length == this.maxRow) {
        this.isVisible = true;
      }
    })

  }

  onSetGroup(event: any) {
    var group = event.itemData;

    var vc = this.dataGrid?.instance.getVisibleColumns();
    if(vc) {
      console.log('cols: ' + JSON.stringify(vc))
      vc.forEach((v, i) => {
        if(v.name == event.itemData) {
          this.dataGrid?.instance.clearGrouping();
          this.dataGrid?.instance.columnOption(group, 'groupIndex', 0);
          return;
        }
      })
    }
  }

}
