import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { environment } from '../../../environments/environment';
import { MekaService } from '../../service/meka.service';
import { NotificationService } from '../../service/notification.service';


@Component({
  selector: 'app-request-leave',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './request-leave.component.html',
  styleUrl: './request-leave.component.css'
})
export class RequestLeaveComponent {

  token = JSON.parse(localStorage.getItem('token'));
  mekaService= inject(MekaService);
  notificationService= inject(NotificationService);
  weekends = environment.weekends
  requestDates = new FormGroup({
    'fromDate': new FormControl(null,[Validators.required]),
    'toDate':new FormControl(null,Validators.required)
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
    const formDate = this.requestDates.value.fromDate
    const toDate = this.requestDates.value.toDate
    const getAbsentDates =await this.generateDateObjectsExcludingWeekends(formDate,toDate)
    if(getAbsentDates){
      this.mekaService.requestLeave(getAbsentDates,this.token).subscribe(res=>{
        if(!res['error']){
          this.notificationService.notify({severity:'success', summary: 'Successfull', detail: res['message'], sticky: true})
        }else{
          this.notificationService.notify({severity:'error', summary: 'Failed', detail: res['message'], sticky: true})
        }
      },err=>{
        const errMessage = err.name
        this.notificationService.notify({severity:'error', summary: 'Failed', detail: errMessage , sticky: false})
      })
    }
  }else{
    this.notificationService.notify({ severity: 'info', summary: 'Invalid Form', detail: 'Response is empty or invalid', life: 3000 });
  }
}
}
