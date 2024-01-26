import { Component, Input } from '@angular/core';
import { SafeDatePipe } from '../shared/pipes/safe-date.pipe';
import { DecimalTimeShortPipe } from '../shared/pipes/decimal-time-short.pipe';

@Component({
    selector: 'app-mtable',
    standalone: true,
    templateUrl: './mtable.component.html',
    styleUrl: './mtable.component.css',
    providers: [SafeDatePipe,DecimalTimeShortPipe],
    imports: [SafeDatePipe,DecimalTimeShortPipe]
})
export class MtableComponent {
  @Input() tableData: any[] = [];
  todaysDate = new Date().getDate()
}
