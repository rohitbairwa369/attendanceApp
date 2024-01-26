import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'decimalToTime',
  standalone: true
})
export class DecimalToTimePipe implements PipeTransform {

  transform(value: number): string {
    // Check if the input is a valid number
    if (isNaN(value)) {
      return 'Invalid input';
    }

    // Extract the whole hours and minutes
    const hours = Math.floor(value);
    const minutes = Math.round((value - hours) * 60);

    // Format the result as hours and minutes
    return `${hours} hours, ${minutes} minutes`;
  }

}
