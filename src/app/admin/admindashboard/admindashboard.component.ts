import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { NotificationService } from '../../service/notification.service';
import { Router } from '@angular/router';
import { takeUntil } from 'rxjs';
import { MekaService } from '../../service/meka.service';
import { unsub } from '../../shared/unsub.class';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { TableModule } from 'primeng/table';
import { AvatarModule } from 'primeng/avatar';
import { AvatarGroupModule } from 'primeng/avatargroup';
import { ShowBirthdayComponent } from '../../shared/show-birthday/show-birthday.component';
import { SkeletonModule } from 'primeng/skeleton';

@Component({
  selector: 'app-admindashboard',
  standalone: true,

  imports: [
    ButtonModule,
    CommonModule,
    TableModule,
    InputTextModule,
    AvatarModule,
    AvatarGroupModule,
    ShowBirthdayComponent,
    SkeletonModule,
  ],
  providers: [MekaService, NotificationService],
  templateUrl: './admindashboard.component.html',
  styleUrl: './admindashboard.component.css',
})
export class AdmindashboardComponent extends unsub implements OnInit {
  notificationService = inject(NotificationService);
  router = inject(Router);
  selectedUser: any;
  usersData: any;
  isLoading: boolean = true;
  token = JSON.parse(localStorage.getItem('token'));

  constructor(private mekaService: MekaService) {
    super();
  }
  ngOnInit(): void {
    this.mekaService
      .getUsersData(this.token)
      .pipe(takeUntil(this.onDestroyed$))
      .subscribe(
        (user) => {
          this.usersData = user;
        },
        (err) => {
          this.notificationService.notify({
            severity: 'error',
            summary: 'API Failure',
            detail: 'Failed to connect',
            sticky: true,
          });
        }
      );
  }
  navigateToReport(id) {
    this.router.navigate([`admin/mreport/${id}`]);
  }
}
