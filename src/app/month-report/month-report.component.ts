import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MekaService } from '../service/meka.service';
import { NotificationService } from '../service/notification.service';
import { takeUntil } from 'rxjs';
import { unsub } from '../shared/unsub.class';
import { CommonModule, JsonPipe } from '@angular/common';
import { TagModule } from 'primeng/tag';
import { DecimalTimeShortPipe } from '../shared/pipes/decimal-time-short.pipe';

@Component({
  selector: 'app-month-report',
  standalone: true,
  imports:[TagModule,CommonModule,JsonPipe,DecimalTimeShortPipe],
  providers: [MekaService,NotificationService],
  templateUrl: './month-report.component.html',
  styleUrl: './month-report.component.css'
})
export class MonthReportComponent extends unsub {
  token = JSON.parse(localStorage.getItem('token'));
  userData:any;
  monthColors = {
  "Jan": "#b0d9e2", 
  "Feb": "#b4c8a9", 
  "Mar": "#b8c0b1", 
  "Apr": "#d8bcb9", 
  "May": "#c7c9b8", 
  "Jun": "#b8d5c7", 
  "Jul": "#b8c0c7", 
  "Aug": "#b8c7c7", 
  "Sep": "#d8c7b8", 
  "Oct": "#c8c7b8", 
  "Nov": "#c7b8b8", 
  "Dec": "#d8d5b8"  
};

  constructor(private route:ActivatedRoute,private mekaService:MekaService){
   super()
   const userid = this.route.snapshot.paramMap.get('id')
   if(userid.length>0){
    this.mekaService.getUserById(userid,this.token).pipe(takeUntil(this.onDestroyed$)).subscribe(data=>{
      this.userData = data;
    })
   }
  }
}
