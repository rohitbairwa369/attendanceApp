import { Component, OnInit, inject } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { environment } from '../../../environments/environment';
import { MekaService } from '../../service/meka.service';
import { NotificationService } from '../../service/notification.service';
import { CalendarModule } from 'primeng/calendar';
import { ButtonModule } from 'primeng/button';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { Title } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { takeUntil,forkJoin } from 'rxjs';
import { unsub } from '../../shared/unsub.class';
import { TagModule } from 'primeng/tag';
import { DropdownModule } from 'primeng/dropdown';

@Component({
  selector: 'app-request-leave',
  standalone: true,
  imports: [CommonModule,ReactiveFormsModule,CalendarModule,ButtonModule,InputTextareaModule,FormsModule,TagModule,DropdownModule],
  templateUrl: './request-leave.component.html',
  styleUrl: './request-leave.component.css'
})
export class RequestLeaveComponent  extends unsub implements OnInit{

  attendanceData:any;
  onlyPresentdays:any[] =[];
  onlyYearHoliday :any =[];
  alreadyAbsentDays:any[]=[];
  holidaysWithDesc:any[]=[];
  categoryReason: any[]=[];
  selectedCategory:  undefined;
  months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  todaysDate= new Date();
  constructor(private titleService: Title){
    super()
    this.titleService.setTitle("Meka - Request Leave")
  }


  onlyAbsentDate=[]
  token = JSON.parse(localStorage.getItem('token'));
  mekaService= inject(MekaService);
  notificationService= inject(NotificationService);
  weekends = environment.weekends
  requestDates = new FormGroup({
    'category':new FormControl(null,Validators.required),
    'desc': new FormControl(null,Validators.required)
  })
  
  ngOnInit(): void {
    this.categoryReason = [
    { name: 'Sick Leave', code: 'SL' },
    { name: 'Personal Leave', code: 'PL' },
    { name: 'Maternity/Paternity Leave', code: 'MPL' },
    { name: 'Bereavement Leave', code: 'BL' },
    { name: 'Vacation Leave', code: 'VL' },
    { name: 'Medical Appointment', code: 'MA' },
    { name: 'Other', code: 'OT' }
];
this.notificationService.showLoader();
    forkJoin([
      this.mekaService.getAttendance(
        this.todaysDate.toLocaleString('default', { month: 'short' }),
        this.todaysDate.getFullYear()
      ),
      this.mekaService.getHolidays(this.token, this.todaysDate.toLocaleString('default', { month: 'short' }))
    ]).pipe(takeUntil(this.onDestroyed$))
      .subscribe(
        ([attendance, holidays]:any) => {
          this.attendanceData = attendance;
          this.attendanceData.forEach(item => {
            if (item.status == "Present") {
              this.onlyPresentdays.push(parseInt(item.date))
            } else if (item.status == "Absent") {
              this.alreadyAbsentDays.push(parseInt(item.date))
            }
          });

          holidays.forEach(item => {
            this.onlyYearHoliday.push(item.date);
            this.holidaysWithDesc.push(item)
          });
          this.notificationService.hideLoader();
        },
        (err) => {
          this.notificationService.notify({
            severity: 'error',
            summary: 'API Failure',
            detail: 'Failed to connect',
            sticky: true,
          });
          this.notificationService.hideLoader();
        }
      );
  }

//  generateDateObjectsExcludingWeekends(fromDate, toDate) {
//     const result = [];
//     let currentDate = new Date(fromDate);
  
//     while (currentDate <= new Date(toDate)) {
//       const day = new Intl.DateTimeFormat('en-US', { weekday: 'short' }).format(currentDate);
  
//       if (!this.weekends.includes(day)) {
//         const formattedDate = currentDate.getDate().toString();
//         const month = new Intl.DateTimeFormat('en-US', { month: 'short' }).format(currentDate);
  
//         result.push({
//           date: formattedDate,
//           day: day,
//           out: "-",
//           hours: "0",
//           status: "Absent",
//           in: "-",
//           month: month,
//           year: currentDate.getFullYear(),
//         });
//       }
  
//       currentDate.setDate(currentDate.getDate() + 1);
//     }
  
//     return result;
//   }
  
  async onRequestleave(){
    if(this.requestDates.valid){
      this.notificationService.showLoader();
    var getAbsentDatesArray =[]
    this.onlyAbsentDate.forEach(item=>{
      const currentDate = new Date(`${this.todaysDate.getFullYear()}-${(this.todaysDate.getMonth() + 1).toString().padStart(2, '0')}-${item.toString().padStart(2, '0')}`);
      const day = new Intl.DateTimeFormat('en-US', { weekday: 'short' }).format(currentDate);
      if(!this.weekends.includes(day)){
       var dateObject = {
        date: item,
        day: day,
        out: "-",
        hours: "0",
        status: "Absent",
        in: "-",
        month: this.todaysDate.toLocaleString('default', { month: 'short' }),
        year: this.todaysDate.getFullYear(),
      }
      getAbsentDatesArray.push(dateObject)
    }
    })
    if(getAbsentDatesArray){
      const absentArrayLength = getAbsentDatesArray.length-1;
      this.mekaService.requestLeave(getAbsentDatesArray,this.token).subscribe(res=>{
        if(!res['error']){
          const inboxObject = {
            'fromDate': `${getAbsentDatesArray[0].date}/${getAbsentDatesArray[0].month}/${getAbsentDatesArray[0].year}` ,
            'toDate': `${getAbsentDatesArray[absentArrayLength].date}/${getAbsentDatesArray[absentArrayLength].month}/${getAbsentDatesArray[absentArrayLength].year}` ,
            'message':this.requestDates.value.desc,
            'category':this.requestDates.value.category['name']
          }
          this.requestDates.reset()
          this.mekaService.postNotice(inboxObject,this.token).subscribe(isMsg=>{
            this.notificationService.notify({severity:'success', summary: 'Sent', detail: 'Notified to everyone', life: 3000 })
            this.notificationService.hideLoader();
          },err=>{
            this.notificationService.hideLoader();
            this.notificationService.notify({severity:'error', summary: 'Failed', detail: err.name, life: 3000 })
          })
          this.notificationService.hideLoader();
          this.notificationService.notify({severity:'success', summary: 'Successfull', detail: res['message'], life: 3000 })
        }else{
          this.notificationService.hideLoader();
          this.notificationService.notify({severity:'error', summary: 'Failed', detail: res['message'], sticky: true})
        }
      },err=>{
        this.notificationService.hideLoader();
        this.notificationService.notify({severity:'error', summary: 'Failed', detail: err.name , sticky: false})
      })
    }
  }else{
    this.notificationService.notify({ severity: 'info', summary: 'Invalid Form', detail: 'Response is empty or invalid', life: 3000 });
  }
}


catchMonthCalendar(event) {
  this.notificationService.showLoader();
  this.onlyPresentdays = [];
  this.alreadyAbsentDays = [];
  this.onlyYearHoliday = [];
  this.holidaysWithDesc=[];

  forkJoin([
    this.mekaService.getAttendance(this.months[event.month - 1], event.year),
    this.mekaService.getHolidays(this.token, this.months[event.month - 1])
  ]).pipe(takeUntil(this.onDestroyed$))
    .subscribe(
      ([attendance, holidays]:any) => {
        this.attendanceData = attendance;
        this.attendanceData.forEach(item => {
          if (item.status == "Present") {
            this.onlyPresentdays.push(parseInt(item.date))
          } else if (item.status == "Absent") {
            this.alreadyAbsentDays.push(parseInt(item.date))
          }
        });

        holidays.forEach(item => {
          this.onlyYearHoliday.push(item.date);
          this.holidaysWithDesc.push(item)
        });
        this.notificationService.hideLoader();
      },
      (err) => {
        this.notificationService.notify({
          severity: 'error',
          summary: 'API Failure',
          detail: 'Failed to connect',
          sticky: true,
        });
        this.notificationService.hideLoader();
      }
    );
}

getAbsentDates(date){
  const currentDate = new Date(`${this.todaysDate.getFullYear()}-${(this.todaysDate.getMonth() + 1).toString().padStart(2, '0')}-${date.day.toString().padStart(2, '0')}`);
  const day = new Intl.DateTimeFormat('en-US', { weekday: 'short' }).format(currentDate);
  if(!this.weekends.includes(day)){
  if(this.onlyAbsentDate.includes(date.day)){
   var absentIndex =this.onlyAbsentDate.findIndex((item)=>{
      return item == date.day
    })
   
    this.onlyAbsentDate.splice(absentIndex,1)
    
  }else{
    this.onlyAbsentDate.push(date.day)
  }
}
}

}
