import { Component, OnDestroy, inject } from '@angular/core';
import { MtableComponent } from '../../mtable/mtable.component';
import { MekaService } from '../../service/meka.service';
import { environment } from '../../../environments/environment';
import { CommonModule, DatePipe } from '@angular/common';
import { DecimalToTimePipe } from "../../shared/pipes/decimal-to-time.pipe";
import { SafeDatePipe } from '../../shared/pipes/safe-date.pipe';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { NotificationService } from '../../service/notification.service';
import { DialogModule } from 'primeng/dialog';
import { ConfirmationService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { Router } from '@angular/router';
import { BadgeModule } from 'primeng/badge';
import { AvatarModule } from 'primeng/avatar';
import { CalendarModule } from 'primeng/calendar';
import { Subscription } from 'rxjs';
@Component({
    selector: 'app-dashboard',
    standalone: true,
    templateUrl: './dashboard.component.html',
    styleUrl: './dashboard.component.css',
    providers: [MekaService,NotificationService,ConfirmationService],
    imports: [CommonModule,MtableComponent, DatePipe, DecimalToTimePipe,SafeDatePipe,ConfirmDialogModule,DialogModule,ButtonModule,BadgeModule,AvatarModule,CalendarModule]
  })
export class DashboardComponent implements OnDestroy{
  mekaService= inject(MekaService);
  notificationService = inject(NotificationService)
  confirmationService = inject(ConfirmationService)
  router = inject(Router)
  isClockIn: string = 'clockin';
  todaysDate = new Date()
  tableData:any = [];
  isDialogVisible:boolean=false;
  messageQuery:any={}
  daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  weekends = environment.weekends;
  userData:any={}
  token = JSON.parse(localStorage.getItem('token'));
  private UserSubscription: Subscription;
  constructor(){
    this.UserSubscription = this.mekaService.getUserData(this.token).subscribe(user=>{
      this.userData = user;
    },err=>{
      this.notificationService.notify({severity:'error', summary: 'API Failure', detail: 'Failed to connect', sticky: true})
    })
    this.UserSubscription.add(this.mekaService.getAttendance(this.todaysDate.toLocaleString('default', { month: 'short' }),this.todaysDate.getFullYear()).subscribe(res=>{
      this.tableData = res;
      if(res['auth']==false){
        this.messageQuery = {
          header : "Invalid Token",
          message : "Token Expired. Please Login Again!"
        }
        this.isDialogVisible = true;
        this.tableData = [];
      }else{
      if(!this.weekends.includes(this.daysOfWeek[this.todaysDate.getDay()])){
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
      this.notificationService.notify({severity:'error', summary: 'API Failure', detail: 'Failed to connect', sticky: true})
    }))
    setInterval(() => { 
      this.todaysDate = new Date();
    }, 1000);

  }
  ngOnDestroy(): void {
    this.UserSubscription.unsubscribe();
  }

  clockIn(){
    this.isClockIn =  'clockout';
    const logdetail =  { date: this.todaysDate.getDate().toString(), day: this.daysOfWeek[this.todaysDate.getDay()], out: '-', hours: 0, status : 'Present', in : this.todaysDate};
    this.mekaService.userClockIn(logdetail).subscribe(res=>{
      this.tableData = res;
    },err=>{
      this.notificationService.notify({severity:'error', summary: 'Error ', detail: 'Unable to clockin'})
    })
  }

  confirmationDialogue(){
      this.confirmationService.confirm({
          header: 'Are you sure?',
          message: 'Please confirm to proceed.',
          accept: () => {
             this.clockOut()
          },
          reject: () => {
          }
      });
  }

  confirmationAbsent(){
    this.confirmationService.confirm({
        header: 'Are You Absent Today?',
        message: 'Please confirm to proceed.',
        accept: () => {
          if(this.isClockIn !='clockout'){
           this.iAmAbsent()
          }else{
            this.notificationService.notify({severity:'error', summary: 'Error', detail: 'Unable to mark absent'})
          }
        },
        reject: () => {
        }
    });
}

  iAmAbsent(){
    const logdetail =  { date: this.todaysDate.getDate().toString(), day: this.daysOfWeek[this.todaysDate.getDay()], out: '-', hours: 0, status : 'Absent', in : '-'};
    this.mekaService.userClockIn(logdetail).subscribe(res=>{
      this.tableData = res;
    },err=>{
      this.notificationService.notify({severity:'error', summary: 'Error ', detail: 'Unable to clockin'})
    })
  }
  additionalCheck(){
    const pDate= this.todaysDate.getDate();
    if(pDate - this.tableData[0].date>1 && pDate - this.tableData[0].date <4){
      for(let i= this.tableData[0].date;i< pDate; i++){
        let getThatDay = `${i} ${this.todaysDate.toLocaleString('default', { month: 'short' })} ${this.todaysDate.getFullYear()}`
        let getDateFormat =  new Date(getThatDay)
        const logdetail =  { date: i, day: this.daysOfWeek[getDateFormat.getDay()], out: '-', hours: 0, status : 'Holiday', in : this.todaysDate};
        this.mekaService.userClockIn(logdetail).subscribe(res=>{
          this.tableData = res;
        })
      }
    }
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
      this.notificationService.notify({severity:'error', summary: 'Error', detail: 'Unable to clockout', sticky: true})
    })
  }

  navigateToLogin(){
    localStorage.clear()
    this.router.navigate(['login'])
  }
}
