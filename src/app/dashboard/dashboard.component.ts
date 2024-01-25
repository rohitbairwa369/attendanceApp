import { Component, inject } from '@angular/core';
import { MtableComponent } from '../mtable/mtable.component';
import { MekaService } from '../service/meka.service';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [MtableComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
  providers:[MekaService]
})
export class DashboardComponent {
  mekaService= inject(MekaService);
  isClockIn: string = 'clockin';
  todaysDate = new Date()
  tableData:any = [];
  daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  constructor(){
    this.mekaService.getAttendance(this.todaysDate.toLocaleString('default', { month: 'short' }),this.todaysDate.getFullYear()).subscribe(res=>{
      this.tableData = res;
      const weekends = environment.weekends;
      if(!weekends.includes(this.daysOfWeek[this.todaysDate.getDay()])){
        this.tableData.unshift({ date: this.todaysDate.getDate().toString(), day: this.daysOfWeek[this.todaysDate.getDay()], status: '-', in: '-', out: '-', hours: '-' })
      }else{
        this.tableData.unshift({ date: this.todaysDate.getDate().toString(), day: this.daysOfWeek[this.todaysDate.getDay()], status: 'Holiday', in: '-', out: '-', hours: '-' })
      }
    },err=>{
      console.log(err)
    })
  }
  clockIn(){
    this.isClockIn =  'clockout';
    const logdetail =  { date: this.todaysDate.getDate().toString(), day: this.daysOfWeek[this.todaysDate.getDay()], out: '-', hours: '-', status : 'Present', in : this.todaysDate};
    this.mekaService.userClockIn(logdetail).subscribe(res=>{
      this.tableData = res;
    },err=>{
      console.log(err)
    })
  }

  clockOut(){
    this.isClockIn =  "denied";
    const logdetail  = {
     in : this.tableData[0].in,
     out : this.todaysDate
    }
    this.mekaService.userClockOut(this.todaysDate.getDate(),logdetail).subscribe(res=>{
      if(res['attendance']){
      this.tableData = res['attendance']
      }
    },err=>{
      console.log(err)
    })
  }
}
