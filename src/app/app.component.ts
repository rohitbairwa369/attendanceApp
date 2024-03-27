import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { NotificationService } from './service/notification.service';
import { Subscription } from 'rxjs';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet,HttpClientModule,ToastModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  providers: [DatePipe,HttpClient,MessageService,NotificationService]
})
export class AppComponent implements OnDestroy,OnInit {
  title = 'attendanceApp';
  isLoading:boolean=false;
  private loaderSubscription: Subscription;

  constructor(private loadingService:NotificationService){}

  ngOnInit(): void {
    this.loaderSubscription = this.loadingService.loaderSubject.subscribe(
      (state) => {
        this.isLoading = state;
      }
    );
  }
  ngOnDestroy() {
    // Unsubscribe to prevent memory leaks
    this.loaderSubscription.unsubscribe();
  }
}
