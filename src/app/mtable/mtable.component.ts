import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-mtable',
  standalone: true,
  imports: [],
  templateUrl: './mtable.component.html',
  styleUrl: './mtable.component.css'
})
export class MtableComponent {
  @Input() tableData: any[] = [];
  todaysDate = new Date().getDate()
}
