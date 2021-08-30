import { Component, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { Options, LabelType, ChangeContext } from "@angular-slider/ngx-slider";
import { DateRange } from '../model/DateRange';
import { SharedService } from '../service/shared.service';

const DAYS_UNIT = (1000 * 60 * 60 * 24);

@Component({
  selector: 'app-date-range',
  templateUrl: './date-range.component.html',
  styleUrls: ['./date-range.component.css']
})
export class DateRangeComponent implements OnInit {

  startDate: string | null

  endDate: string | null

  minDate; maxDate;

  minValue: number;
  maxValue: number;
  options: Options

  constructor(private datePipe: DatePipe, private sharedService: SharedService) { 

    var date = new Date();
    var date2 = new Date(date);

    this.minDate = new Date(date2.setMonth(date2.getMonth()-3));
    this.maxDate = date;
    this.startDate = this.datePipe.transform(this.minDate, "yyyy-MM-dd")
    this.endDate = this.datePipe.transform(this.maxDate, "yyyy-MM-dd")

    var duration = (this.maxDate.getTime() - this.minDate.getTime()) / DAYS_UNIT;
    var minMax = (date.getTime() - this.minDate.getTime()) / DAYS_UNIT;
    this.minValue = this.maxValue = minMax;

    this.options = {
      floor: 0,
      ceil: duration,
      translate: (value: number, label: LabelType): string => {

        var date = new Date();
        date.setTime(this.minDate.getTime() + (value * DAYS_UNIT))
        var formatted = this.datePipe.transform(date, "yyyy-MM-dd");

        if (formatted)
          return formatted;

        return "Oppsss..."

      }
    };
    
  }

  ngOnInit(): void {
  }

  onSliderChange(changeContext : ChangeContext) {

    var min = new Date()
    min.setTime(this.minDate.getTime() + changeContext.value * DAYS_UNIT);

    var max = new Date()
    if(changeContext.highValue)
      max.setTime(this.minDate.getTime() + changeContext.highValue * DAYS_UNIT)

    var range = new DateRange();
    range.from = min;
    range.to = max;

    // broadcast
    this.sharedService.setDateRange(range);
  }
}
