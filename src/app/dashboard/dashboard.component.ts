import { Component } from '@angular/core';
import { MtableComponent } from '../mtable/mtable.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [MtableComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {
  isClockIn: string = 'clockin';
  tableData = [
    { date: '23', day: 'Thu', status: '-', in: '-', out: '-', hours: '-' },
    { date: '27', day: 'Fri', status: 'Absent', in: '09:30', out: '16:45', hours: '7.25' },
    { date: '26', day: 'Sat', status: 'Present', in: '10:00', out: '18:30', hours: '8.5' },
    { date: '25', day: 'Sun', status: 'Present', in: '11:00', out: '17:45', hours: '6.75' },
    { date: '24', day: 'Mon', status: 'Absent', in: '09:15', out: '16:30', hours: '7.25' }, 
    { date: '25', day: 'Tue', status: 'Present', in: '08:45', out: '17:15', hours: '8.5' },
    { date: '22', day: 'Wed', status: 'Present', in: '09:30', out: '18:00', hours: '8.5' },
    { date: '21', day: 'Thu', status: 'Absent', in: '10:15', out: '16:45', hours: '6.5' },
    { date: '20', day: 'Sat', status: 'Present', in: '10:00', out: '18:30', hours: '8.5' },
    { date: '19', day: 'Sun', status: 'Present', in: '11:00', out: '17:45', hours: '6.75' },
    { date: '18', day: 'Mon', status: 'Absent', in: '09:15', out: '16:30', hours: '7.25' }, 
    { date: '17', day: 'Tue', status: 'Present', in: '08:45', out: '17:15', hours: '8.5' },
    { date: '16', day: 'Wed', status: 'Present', in: '09:30', out: '18:00', hours: '8.5' },
    { date: '15', day: 'Thu', status: 'Absent', in: '10:15', out: '16:45', hours: '6.5' },
  ];
  clockIn(){
    this.isClockIn =  'clockout';
  }

  clockOut(){
    this.isClockIn =  "denied";
    this.tableData[0].status = 'Present';
    this.tableData[0].in = '09:00';
    this.tableData[0].out = '17:00';
    this.tableData[0].hours = '8';
  }
}
