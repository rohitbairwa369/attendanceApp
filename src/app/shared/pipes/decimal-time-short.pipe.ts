import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'decimalTimeShort',
  standalone: true
})
export class DecimalTimeShortPipe implements PipeTransform {

  transform(value: number): string {
    // Check if the input is a valid number
    if (isNaN(value)) {
      return 'Invalid input';
    }

    // Extract the whole hours and minutes
    const hours = Math.floor(value);
    const minutes = Math.round((value - hours) * 60);

    // Format the result as hours and minutes
    if(hours!=0){
      return `${hours} hr, ${minutes} min`;
    }else{
      return `${minutes} min`;
    }
  }

}
