import { Component } from '@angular/core';
import { MekaService } from '../../service/meka.service';
import { takeUntil } from 'rxjs';
import { unsub } from '../../shared/unsub.class';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { CalendarModule } from 'primeng/calendar';
import { InputTextModule } from 'primeng/inputtext';


@Component({
  selector: 'app-add-holidays',
  standalone: true,
  imports: [CommonModule,ReactiveFormsModule,CalendarModule,ButtonModule,InputTextModule],
  templateUrl: './add-holidays.component.html',
  styleUrl: './add-holidays.component.css'
})
export class AddHolidaysComponent extends unsub{

  holidays:any[]
  holidayForm: FormGroup;
constructor(private mekaService:MekaService,private formBuilder: FormBuilder){
  super()
  const token = JSON.parse(localStorage.getItem('token'))
  this.mekaService.getUserData(token).pipe(takeUntil(this.onDestroyed$)).subscribe(res=>{
    if(res.hasOwnProperty('holidays')){
    this.holidays = res['holidays'];
    }
    })
    this.initHolidayForm()
}

private initHolidayForm(): void {
  this.holidayForm = this.formBuilder.group({
    date: ['', Validators.required],
    reason: ['', Validators.required]
  });
}

addHoliday() {
  let todaysDate = new Date(this.holidayForm.value.date)
  const newHoliday=  {
    date: todaysDate.getDate(),
    day: todaysDate.toLocaleDateString('en-US', { weekday: 'short' }),
    out: "-",
    hours: "0",
    status: this.holidayForm.value.reason,
    in: "-",
    month: todaysDate.toLocaleDateString('en-US', { month: 'short' }),
    year: todaysDate.getFullYear()
  }
    this.holidays.push(newHoliday);
    const token = JSON.parse(localStorage.getItem('token'))
    this.mekaService.addHolidays(this.holidays,token).subscribe(res=>{
      this.holidayForm.reset();
    })
}

}
