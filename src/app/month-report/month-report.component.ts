import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MekaService } from '../service/meka.service';
import { NotificationService } from '../service/notification.service';
import { forkJoin, takeUntil } from 'rxjs';
import { unsub } from '../shared/unsub.class';
import { CommonModule, JsonPipe } from '@angular/common';
import { TagModule } from 'primeng/tag';
import { DecimalTimeShortPipe } from '../shared/pipes/decimal-time-short.pipe';
import { ButtonModule } from 'primeng/button';
import { ChartModule } from 'primeng/chart';
import { TableModule } from 'primeng/table';
import { DropdownModule } from 'primeng/dropdown';
import { FormsModule } from '@angular/forms';
@Component({
  selector: 'app-month-report',
  standalone: true,
  imports: [
    ButtonModule,
    TagModule,
    CommonModule,
    JsonPipe,
    DecimalTimeShortPipe,
    ChartModule,
    TableModule,
    DropdownModule,
    FormsModule
  ],
  providers: [MekaService, NotificationService],
  templateUrl: './month-report.component.html',
  styleUrl: './month-report.component.css',
})
export class MonthReportComponent extends unsub implements OnInit, OnDestroy {
  token = JSON.parse(localStorage.getItem('token'));
  userData: any;
  dates: any = [];
  hours: any = [];
  userPresent: any;
  basicData: any;
  basicOptions: any;
  pieData: any;
  pieOptions: any;
  months: string[] = [
    'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'
  ]
  selectedMonth: string;
  remainingLeaves:any;
  todaysDate = new Date();

  constructor(
    private route: ActivatedRoute,
    private mekaService: MekaService,
    private router: Router,
    private notify : NotificationService
  ) {
    super();
  }

  ngOnInit() {
    this.selectedMonth = this.months[this.todaysDate.getMonth()]
    this.notify.showLoader();
    const userid = this.route.snapshot.paramMap.get('id');
    if (userid.length > 0) {
      let postData = {
        month: this.todaysDate.toLocaleString('default', { month: 'short' }),
        year: this.todaysDate.getFullYear(),
        userId: userid,
        status: 'absent',
      };
      this.getMonthlyReport(postData)
    }
  }

  getMonthlyReport(postData){
    let observables = [];
    observables.push(
      this.mekaService.getUserDataAnalytics(postData, this.token)
        .pipe(takeUntil(this.onDestroyed$))
    );
    postData.status = 'present';
    observables.push(
      this.mekaService.getUserDataAnalytics(postData, this.token)
        .pipe(takeUntil(this.onDestroyed$))
    );
     
    forkJoin(observables).subscribe(
      (results:any[]) => {
        this.userData = results[0];
        this.userPresent = results[1];
        setTimeout(() => {
          this.setGraphData();
          this.setpieChartData();
        }, 500);
        this.notify.hideLoader();
      },
      (error) => {
        console.error('Error occurred:', error);
      }
    );

  }

  backTohome() {
    this.router.navigate(['admin']);
  }
  setGraphData() {
    const documentStyle = getComputedStyle(document.documentElement);
    const textColor = documentStyle.getPropertyValue('--text-color');
    const textColorSecondary = documentStyle.getPropertyValue(
      '--text-color-secondary'
    );
    const surfaceBorder = documentStyle.getPropertyValue('--surface-border');

    this.basicData = {
      labels: this.userPresent.analiticsData.dates,
      datasets: [
        {
          label: 'hours',
          data: this.userPresent.analiticsData.hours,
          backgroundColor: ['skyblue'],
          borderColor: ['rgb(54, 162, 235)'],
        },
      ],
    };

    this.basicOptions = {
      plugins: {
        legend: {
          labels: {
            color: textColor,
          },
        },
      },
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            color: textColorSecondary,
          },
          grid: {
            color: surfaceBorder,
            drawBorder: false,
          },
        },
        x: {
          ticks: {
            color: textColorSecondary,
          },
          grid: {
            color: surfaceBorder,
            drawBorder: false,
          },
        },
      },
    };
  }
  setpieChartData() {
    const documentStyle = getComputedStyle(document.documentElement);
    const textColor = documentStyle.getPropertyValue('--text-color');
    this.pieData = {
      labels: ['absent', 'present'],
      datasets: [
        {
          data: [
            this.userData.totalLeaves,
            this.userPresent.attendanceForLeaves.length,
          ],
          background: [
            documentStyle.getPropertyValue('--blue-500'),
            documentStyle.getPropertyValue('--yellow-500'),
          ],
          hoverBackgroundColor: [
            documentStyle.getPropertyValue('--blue-400'),
            documentStyle.getPropertyValue('--yellow-400'),
          ],
        },
      ],
    };
    this.pieOptions = {
      plugins: {
        legend: {
          labels: {
            usePointStyle: true,
            color: textColor,
          },
        },
      },
    };
  }

  onMonthChange() {
    this.notify.showLoader();
    const userid = this.route.snapshot.paramMap.get('id');
    let postData = {
      month: this.selectedMonth.slice(0,3),
      year: this.todaysDate.getFullYear(),
      userId: userid,
      status: 'absent',
    };
    this.getMonthlyReport(postData)
  }
}
