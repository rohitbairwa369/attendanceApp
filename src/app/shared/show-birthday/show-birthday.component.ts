import { Component, OnInit, inject } from '@angular/core';
import { MekaService } from '../../service/meka.service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-show-birthday',
  standalone: true,
  imports: [DatePipe],
  templateUrl: './show-birthday.component.html',
  styleUrl: './show-birthday.component.css'
})
export class ShowBirthdayComponent implements OnInit{

  token = JSON.parse(localStorage.getItem('token'))

  months = [
    "Jan", // January
    "Feb", // February
    "Mar", // March
    "Apr", // April
    "May", // May
    "Jun", // June
    "Jul", // July
    "Aug", // August
    "Sep", // September
    "Oct", // October
    "Nov", // November
    "Dec"  // December
  ];
  
  selectedMonth:any;
  mekaService = inject(MekaService)
  usersbirthday: any;
ngOnInit(): void {
  const token = JSON.parse(localStorage.getItem('token'))
    var todaysDate = new Date();
    this.selectedMonth = todaysDate.getMonth()
    this.mekaService.getWhoseBirthday((todaysDate.getMonth()+1),token).subscribe(res=>{
      this.usersbirthday = res;
    },error=>{

    })
}

previousMonthe(){

if(this.selectedMonth>=1){
this.selectedMonth--;
this.mekaService.getWhoseBirthday((this.selectedMonth+1),this.token).subscribe(res =>{
  this.usersbirthday = res;
})
}else{
  this.selectedMonth =11
}
}

nextMonth(){
  if(this.selectedMonth<=10){
  this.selectedMonth ++;
  this.mekaService.getWhoseBirthday((this.selectedMonth+1),this.token).subscribe(res =>{
  this.usersbirthday = res;
})
  }else{
    this.selectedMonth = 0;
  }
}
}
