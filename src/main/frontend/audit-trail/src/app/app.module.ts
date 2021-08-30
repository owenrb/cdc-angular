import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { DxAccordionModule, DxButtonModule, DxDataGridModule, DxDropDownButtonModule, DxFilterBuilderModule, DxSelectBoxModule, DxToastModule } from 'devextreme-angular';
import { StringifyTablesPipe, SummaryComponent, SummaryEmitterComponent } from './summary/summary.component';
import { DateRangeComponent } from './date-range/date-range.component';
import { NgxSliderModule } from '@angular-slider/ngx-slider';
import {DatePipe} from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { FlexLayoutModule } from '@angular/flex-layout';
import { CapturedColumnsComponent, ColumnEmitterComponent, StringifyColumnsPipe } from './captured-columns/captured-columns.component';
import { ResultComponent } from './result/result.component';
import { TableAuditComponent } from './table-audit/table-audit.component';

@NgModule({
  declarations: [
    AppComponent,
    SummaryComponent,
    DateRangeComponent,
    StringifyTablesPipe,
    CapturedColumnsComponent,
    SummaryEmitterComponent,
    ColumnEmitterComponent,
    StringifyColumnsPipe,
    ResultComponent,
    TableAuditComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    DxButtonModule,
    NgxSliderModule,
    DxDataGridModule,
    HttpClientModule,
    FlexLayoutModule,
    DxSelectBoxModule,
    DxAccordionModule,
    DxDropDownButtonModule,
    DxToastModule,
    DxFilterBuilderModule
  ],
  providers: [DatePipe],
  bootstrap: [AppComponent]
})
export class AppModule { }
