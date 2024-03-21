import { Component } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MekaService } from '../../service/meka.service';
import { MtableComponent } from '../../mtable/mtable.component';
import { NotificationService } from '../../service/notification.service';
import { CalendarModule } from 'primeng/calendar';
import { ButtonModule } from 'primeng/button';
import { Title } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-attendance-report',
  standalone: true,
  imports: [CommonModule,ReactiveFormsModule,MtableComponent,CalendarModule,ButtonModule,FormsModule],
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
  onlyAbsentDate=[]
  todaysDate=new Date();
  selectedMonth:string='Please select a month!'

  constructor(private titleService: Title,private mekaService:MekaService,private notify:NotificationService){
    this.titleService.setTitle("Meka - Report")
  }

  onSubmit(){
    if(this.reportForm.valid){
      this.loading = true;
      this.onlyAbsentDate=[]
      const dateyear = this.reportForm.value.monthYear.toString()
    const data = {
      month : dateyear.split(' ')[1],    //   month : this.months[this.reportForm.value.monthYear.split('-')[1]-1],
      year : dateyear.split(' ')[3]
    }
    this.selectedMonth = data.month;
    this.mekaService.getAbsentDates(data,this.token).subscribe(res=>{
    this.absentData = res;
    if(this.absentData && this.absentData.length>0){
    var newDate =`${this.absentData[0].date}/${this.absentData[0].month}/${this.absentData[0].year}`
    this.todaysDate= new Date(newDate)
    }else{
      this.todaysDate=new Date()
    }
    this.absentData.forEach(element => {
      this.onlyAbsentDate.push(parseInt(element.date))
    });
    this.loading = false;
    })
    }else{
      this.notify.notify({ severity: 'info', summary: 'Invalid Form', detail: 'Response is empty or invalid', life: 3000 })
    }
  }


}
