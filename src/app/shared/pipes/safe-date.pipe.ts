import { DatePipe } from '@angular/common';
import { Pipe, PipeTransform, inject } from '@angular/core';

@Pipe({
  name: 'safeDate',
  standalone: true
})
export class SafeDatePipe implements PipeTransform {

  datepipe = inject(DatePipe)
  transform(value: any): string {
    // Check if the input is a valid date
    const isDate = !isNaN(Date.parse(value));
    return isDate ? this.datepipe.transform(value,'shortTime') : value;
  }

}
