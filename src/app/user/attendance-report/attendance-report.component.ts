import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MekaService } from '../../service/meka.service';
import { MtableComponent } from '../../mtable/mtable.component';
import { NotificationService } from '../../service/notification.service';
import { CalendarModule } from 'primeng/calendar';
import { ButtonModule } from 'primeng/button';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-attendance-report',
  standalone: true,
  imports: [ReactiveFormsModule,MtableComponent,CalendarModule,ButtonModule],
  templateUrl: './attendance-report.component.html',
  styleUrl: './attendance-report.component.css'
})
export class AttendanceReportComponent {
  loading:boolean = false;
  absentData:any =[];
  months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  token = JSON.parse(localStorage.getItem('token'));
  reportForm = new FormGroup({
    'monthYear': new FormControl(null,[Validators.required]),
  })
  selectedMonth:string='none'

  constructor(private titleService: Title,private mekaService:MekaService,private notify:NotificationService){
    this.titleService.setTitle("Meka - Report")
  }

  onSubmit(){
    if(this.reportForm.valid){
      this.loading = true;
      const dateyear = this.reportForm.value.monthYear.toString()
    const data = {
      month : dateyear.split(' ')[1],    //   month : this.months[this.reportForm.value.monthYear.split('-')[1]-1],
      year : dateyear.split(' ')[3]
    }
    this.selectedMonth = data.month;
    this.mekaService.getAbsentDates(data,this.token).subscribe(res=>{
    this.absentData = res;
    this.loading = false;
    })
    }else{
      this.notify.notify({ severity: 'info', summary: 'Invalid Form', detail: 'Response is empty or invalid', life: 3000 })
    }
  }


}
