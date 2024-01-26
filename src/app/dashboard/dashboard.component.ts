import { Component, inject } from '@angular/core';
import { MtableComponent } from '../mtable/mtable.component';
import { MekaService } from '../service/meka.service';
import { environment } from '../../environments/environment';
import { DatePipe } from '@angular/common';
import { DecimalToTimePipe } from "../shared/pipes/decimal-to-time.pipe";
import { SafeDatePipe } from '../shared/pipes/safe-date.pipe';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { NotificationService } from '../service/notification.service';
import { DialogModule } from 'primeng/dialog';
import { ConfirmationService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { Router } from '@angular/router';
@Component({
    selector: 'app-dashboard',
    standalone: true,
    templateUrl: './dashboard.component.html',
    styleUrl: './dashboard.component.css',
    providers: [MekaService,NotificationService,ConfirmationService],
    imports: [MtableComponent, DatePipe, DecimalToTimePipe,SafeDatePipe,ConfirmDialogModule,DialogModule,ButtonModule]
})
export class DashboardComponent {
  mekaService= inject(MekaService);
  notificationService = inject(NotificationService)
  router = inject(Router)
  isClockIn: string = 'clockin';
  todaysDate = new Date()
  tableData:any = [];
  isDialogVisible:boolean=false;
  messageQuery:any={}
  daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  constructor(){
    this.mekaService.getAttendance(this.todaysDate.toLocaleString('default', { month: 'short' }),this.todaysDate.getFullYear()).subscribe(res=>{
      this.tableData = res;
      if(res['auth']==false){
        this.messageQuery = {
          header : "Invalid Token",
          message : "Token Expired. Please Login Again!"
        }
        this.isDialogVisible = true;
        this.tableData = [];
      }else{
      const weekends = environment.weekends;
      if(!weekends.includes(this.daysOfWeek[this.todaysDate.getDay()])){
        const todaysDateDate = this.todaysDate.getDate();
        if(this.tableData.length>0 && todaysDateDate == this.tableData[0].date){
          if(this.tableData[0].in.length >1){
            this.isClockIn = 'clockout'
          }
          if(this.tableData[0].hours.length > 1){
            this.isClockIn = 'denied'
          }
        }else{
          this.tableData.unshift({ date: this.todaysDate.getDate().toString(), day: this.daysOfWeek[this.todaysDate.getDay()], status: '-', in: '-', out: '-', hours: 0 })
        }
      }else{
        this.tableData.unshift({ date: this.todaysDate.getDate().toString(), day: this.daysOfWeek[this.todaysDate.getDay()], status: 'Holiday', in: '-', out: '-', hours: 0 })
      }
      if(this.tableData.length==0){
        this.tableData.push({ date: this.todaysDate.getDate().toString(), day: this.daysOfWeek[this.todaysDate.getDay()], status: '-', in: '-', out: '-', hours: 0 })
      }
    }
    },err=>{
      this.notificationService.notify({severity:'error', summary: 'Error', detail: err.message})
    })
  }

  clockIn(){
    this.isClockIn =  'clockout';
    const logdetail =  { date: this.todaysDate.getDate().toString(), day: this.daysOfWeek[this.todaysDate.getDay()], out: '-', hours: 0, status : 'Present', in : this.todaysDate};
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
     out : Date()
    }
    this.mekaService.userClockOut(this.todaysDate.getDate(),logdetail).subscribe(res=>{
      this.tableData = res
    },err=>{
      console.log(err)
    })
  }

  navigateToLogin(){
    localStorage.clear()
    this.router.navigate(['login'])
  }
}
