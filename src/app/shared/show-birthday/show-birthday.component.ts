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

mekaService = inject(MekaService)
  usersbirthday: any;
ngOnInit(): void {
  const token = JSON.parse(localStorage.getItem('token'))
    var todaysDate = new Date();
    this.mekaService.getWhoseBirthday((todaysDate.getMonth()+1),token).subscribe(res=>{
      this.usersbirthday = res;
    },error=>{

    })
}
}
