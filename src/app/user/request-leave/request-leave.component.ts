import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { environment } from '../../../environments/environment';
import { MekaService } from '../../service/meka.service';
import { NotificationService } from '../../service/notification.service';
import { CalendarModule } from 'primeng/calendar';
import { ButtonModule } from 'primeng/button';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { Title } from '@angular/platform-browser';


@Component({
  selector: 'app-request-leave',
  standalone: true,
  imports: [ReactiveFormsModule,CalendarModule,ButtonModule,InputTextareaModule],
  templateUrl: './request-leave.component.html',
  styleUrl: './request-leave.component.css'
})
export class RequestLeaveComponent {

  constructor(private titleService: Title){
    this.titleService.setTitle("Meka - Request Leave")
  }
  token = JSON.parse(localStorage.getItem('token'));
  mekaService= inject(MekaService);
  notificationService= inject(NotificationService);
  weekends = environment.weekends
  requestDates = new FormGroup({
    'fromDate': new FormControl(null,[Validators.required]),
    'toDate':new FormControl(null,Validators.required),
    'desc': new FormControl(null,Validators.required)
  })

 generateDateObjectsExcludingWeekends(fromDate, toDate) {
    const result = [];
    let currentDate = new Date(fromDate);
  
    while (currentDate <= new Date(toDate)) {
      const day = new Intl.DateTimeFormat('en-US', { weekday: 'short' }).format(currentDate);
  
      if (!this.weekends.includes(day)) {
        const formattedDate = currentDate.getDate().toString();
        const month = new Intl.DateTimeFormat('en-US', { month: 'short' }).format(currentDate);
  
        result.push({
          date: formattedDate,
          day: day,
          out: "-",
          hours: "0",
          status: "Absent",
          in: "-",
          month: month,
          year: currentDate.getFullYear(),
        });
      }
  
      currentDate.setDate(currentDate.getDate() + 1);
    }
  
    return result;
  }
  

  async onRequestleave(){
    if(this.requestDates.valid){
    const formDate = new Date(this.requestDates.value.fromDate)
    const toDate = new Date(this.requestDates.value.toDate)
    const getAbsentDates =await this.generateDateObjectsExcludingWeekends(formDate,toDate)
    if(getAbsentDates){
      this.mekaService.requestLeave(getAbsentDates,this.token).subscribe(res=>{
        if(!res['error']){
          const inboxObject = {
            'fromDate':formDate,
            'toDate':toDate,
            'message':this.requestDates.value.desc,
            'category':'Other'
          }
          this.mekaService.postNotice(inboxObject,this.token).subscribe(isMsg=>{
            this.requestDates.reset()
            this.notificationService.notify({severity:'success', summary: 'Sent', detail: 'Notified to everyone', life: 3000 })
          },err=>{
            this.notificationService.notify({severity:'error', summary: 'Failed', detail: err.name, life: 3000 })
          })
          this.notificationService.notify({severity:'success', summary: 'Successfull', detail: res['message'], life: 3000 })
        }else{
          this.notificationService.notify({severity:'error', summary: 'Failed', detail: res['message'], sticky: true})
        }
      },err=>{
        this.notificationService.notify({severity:'error', summary: 'Failed', detail: err.name , sticky: false})
      })
    }
  }else{
    this.notificationService.notify({ severity: 'info', summary: 'Invalid Form', detail: 'Response is empty or invalid', life: 3000 });
  }
}
}
