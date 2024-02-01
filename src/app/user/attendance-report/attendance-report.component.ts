import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MekaService } from '../../service/meka.service';
import { MtableComponent } from '../../mtable/mtable.component';
import { NotificationService } from '../../service/notification.service';


@Component({
  selector: 'app-attendance-report',
  standalone: true,
  imports: [ReactiveFormsModule,MtableComponent],
  templateUrl: './attendance-report.component.html',
  styleUrl: './attendance-report.component.css'
})
export class AttendanceReportComponent {
  absentData:any =[];
  months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  token = JSON.parse(localStorage.getItem('token'));
  reportForm = new FormGroup({
    'monthYear': new FormControl(null,[Validators.required]),
  })
  selectedMonth:string='none'

  constructor(private mekaService:MekaService,private notify:NotificationService){}

  onSubmit(){
    if(this.reportForm.valid){
    const data = {
      month : this.months[this.reportForm.value.monthYear.split('-')[1]-1],
      year : this.reportForm.value.monthYear.split('-')[0]
    }
    this.selectedMonth = data.month;
    this.mekaService.getAbsentDates(data,this.token).subscribe(res=>{
    this.absentData = res;
    })
    }else{
      this.notify.notify({ severity: 'info', summary: 'Invalid Form', detail: 'Response is empty or invalid', life: 3000 })
    }
  }


}
