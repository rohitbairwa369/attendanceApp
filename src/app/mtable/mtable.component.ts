import { Component, Input } from '@angular/core';
import { DatePipe } from '@angular/common';
@Component({
  selector: 'app-mtable',
  standalone: true,
  imports: [DatePipe],
  templateUrl: './mtable.component.html',
  styleUrl: './mtable.component.css'
})
export class MtableComponent {
  @Input() tableData: any[] = [];
  todaysDate = new Date().getDate()
}
