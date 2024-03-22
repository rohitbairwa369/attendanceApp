import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MekaService } from '../service/meka.service';
import { NotificationService } from '../service/notification.service';
import { takeUntil } from 'rxjs';
import { unsub } from '../shared/unsub.class';
import { CommonModule, JsonPipe } from '@angular/common';
import { TagModule } from 'primeng/tag';
import { DecimalTimeShortPipe } from '../shared/pipes/decimal-time-short.pipe';
import { ButtonModule } from 'primeng/button';
import { ChartModule } from 'primeng/chart';
import { CardModule } from 'primeng/card';
import { TableModule } from 'primeng/table';
@Component({
  selector: 'app-month-report',
  standalone: true,
  imports: [ButtonModule, TagModule, CommonModule, JsonPipe, DecimalTimeShortPipe, ChartModule,CardModule,TableModule],
  providers: [MekaService, NotificationService],
  templateUrl: './month-report.component.html',
  styleUrl: './month-report.component.css'
})
export class MonthReportComponent extends unsub implements OnInit {
  token = JSON.parse(localStorage.getItem('token'));
  userData: any;
  dates:any=[];
  hours:any=[];
  userPresent: any;
  basicData: any;
  basicOptions: any;
  pieData:any;
  pieOptions:any;
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
  todaysDate = new Date();

  constructor(private route: ActivatedRoute, private mekaService: MekaService, private router: Router) {
    super()

  }

  ngOnInit(){
    const userid = this.route.snapshot.paramMap.get('id')
    if (userid.length > 0) {
      let postData = {
        month: this.todaysDate.toLocaleString('default', { month: 'short' }),
        year: this.todaysDate.getFullYear(),
        userId: userid,
        status: 'absent'
      }
      this.mekaService.getUserDataAnalytics(postData, this.token).pipe(takeUntil(this.onDestroyed$)).subscribe(data => {
        this.userData = data;
        
      })
      postData.status = 'present';
      this.mekaService.getUserDataAnalytics(postData, this.token).pipe(takeUntil(this.onDestroyed$)).subscribe(data => {
        this.userPresent = data;
        setTimeout(()=>{
          this.setGraphData();
          this.setpieChartData()
        })
      })
    }
  }
  backTohome() {
    this.router.navigate(['admin'])
  }

  setGraphData() {
    const documentStyle = getComputedStyle(document.documentElement);
    const textColor = documentStyle.getPropertyValue('--text-color');
    const textColorSecondary = documentStyle.getPropertyValue('--text-color-secondary');
    const surfaceBorder = documentStyle.getPropertyValue('--surface-border');

    this.basicData = {
      labels:this.userPresent.analiticsData.dates,
      datasets: [
          {
              label: 'hours',
              data:this.userPresent.analiticsData.hours,
              backgroundColor: ['skyblue'],
              borderColor: ['rgb(54, 162, 235)'],
              
          }
      ]
  };

  this.basicOptions = {
      plugins: {
          legend: {
              labels: {
                  color: textColor
            
              }
          }
      },
      scales: {
          y: {
              beginAtZero:true,
              ticks: {
                  color: textColorSecondary,                  
                  
                  
              },
              grid: {
                  color: surfaceBorder,
                  drawBorder: false
              }
          },
          x: {
              ticks: {

                  color: textColorSecondary
              },
              grid: {
                  color: surfaceBorder,
                  drawBorder: false
              }
          }
      }
  };
  }
  
setpieChartData(){
  const documentStyle = getComputedStyle(document.documentElement);
  const textColor = documentStyle.getPropertyValue('--text-color');
this.pieData={
  labels:['absent','present'],
  datasets:[
    {
      data:[this.userData.totalLeaves,this.userPresent.attendanceForLeaves.length],
      background:[documentStyle.getPropertyValue('--blue-500'),documentStyle.getPropertyValue('--yellow-500')],
      hoverBackgroundColor: [documentStyle.getPropertyValue('--blue-400'), documentStyle.getPropertyValue('--yellow-400'),]
    }
  ]
};
this.pieOptions = {
  plugins: {
      legend: {
          labels: {
              usePointStyle: true,
              color: textColor
          }
      }
  }
};
}

}






