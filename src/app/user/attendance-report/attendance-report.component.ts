import { Component } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MekaService } from '../../service/meka.service';
import { MtableComponent } from '../../mtable/mtable.component';
import { NotificationService } from '../../service/notification.service';
import { CalendarModule } from 'primeng/calendar';
import { ButtonModule } from 'primeng/button';
import { Title } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { TagModule } from 'primeng/tag';

@Component({
  selector: 'app-attendance-report',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MtableComponent, CalendarModule, ButtonModule, FormsModule,TagModule],
  templateUrl: './attendance-report.component.html',
  styleUrl: './attendance-report.component.css'
})
export class AttendanceReportComponent {
  onBackPreviewDate = new Date()
  loading: boolean = false;
  absentData: any = [];
  months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  token = JSON.parse(localStorage.getItem('token'));
  reportForm = new FormGroup({
    'monthYear': new FormControl(this.onBackPreviewDate, [Validators.required]),
  })
  onlyAbsentDate = []
  onlyHolidays = []
  todaysDate = new Date();
  selectedMonth: string = 'Please select a month!'
  holidaysWithDesc = [];

  constructor(private titleService: Title, private mekaService: MekaService, private notify: NotificationService) {
    this.titleService.setTitle("Meka - Report")
  }

  onSubmit() {
    this.notify.showLoader()
    if (this.reportForm.valid) {
      this.loading = true;
      this.onlyAbsentDate = []
      const dateyear = this.reportForm.value.monthYear.toString()
      const data = {
        month: dateyear.split(' ')[1],    //   month : this.months[this.reportForm.value.monthYear.split('-')[1]-1],
        year: dateyear.split(' ')[3]
      }
      this.selectedMonth = data.month;
      this.mekaService.getAbsentDates(data, this.token).subscribe(res => {
        this.absentData = res;
        if (this.absentData && this.absentData.length > 0) {
          var newDate = `${this.absentData[0].date}/${this.absentData[0].month}/${this.absentData[0].year}`
          this.todaysDate = new Date(newDate)
        } else {
          this.todaysDate = new Date()
        }
        this.absentData.forEach(element => {
          if(element.status == "Absent"){
          this.onlyAbsentDate.push(parseInt(element.date))
          }else{
            this.onlyHolidays.push(parseInt(element.date))
            this.holidaysWithDesc.push(element)
          }
        });
        this.loading = false;
        this.notify.hideLoader()
      })
    } else {
      this.notify.notify({ severity: 'info', summary: 'Invalid Form', detail: 'Response is empty or invalid', life: 3000 })
    }
  }

  catchMonth(event) {
    this.notify.showLoader()
    this.onlyAbsentDate = [];
    this.onlyHolidays = [];
    this.holidaysWithDesc=[];
    const data = {
      month: this.months[event.month - 1],
      year: event.year
    }
    this.selectedMonth = data.month
    this.mekaService.getAbsentDates(data, this.token).subscribe(res => {
      this.absentData = res;
      this.absentData.forEach(element => {
        if(element.status == "Absent"){
          this.onlyAbsentDate.push(parseInt(element.date))
          }else{
            this.onlyHolidays.push(parseInt(element.date))
            this.holidaysWithDesc.push(element)
          }
      });
      const newDate = `01/${data.month}/${data.year}`
      this.reportForm.patchValue({
        'monthYear': new Date(newDate)
      });
      this.notify.hideLoader()
    })

  }
}