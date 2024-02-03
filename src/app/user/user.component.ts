import {  Component, inject } from '@angular/core';
import { NavigationStart, Router, RouterModule } from '@angular/router';
import { AvatarModule } from 'primeng/avatar';
import { SidebarModule } from 'primeng/sidebar';
import { MekaService } from '../service/meka.service';
import { NotificationService } from '../service/notification.service';
import { DialogModule } from 'primeng/dialog';
import { CommonModule } from '@angular/common';
import { BadgeModule } from 'primeng/badge';
import { Observable, takeUntil } from 'rxjs';
import { unsub } from '../shared/unsub.class';
@Component({
  selector: 'app-user',
  standalone: true,
  imports: [RouterModule, SidebarModule, AvatarModule, DialogModule, CommonModule, BadgeModule],
  templateUrl: './user.component.html',
  styleUrl: './user.component.css',
  providers: [MekaService, NotificationService]
})
export class UserComponent extends unsub {
  mekaService = inject(MekaService);
  notificationService = inject(NotificationService)
  router = inject(Router)
  userData: any = {};
  isSidebarVisible: boolean = false;
  isMessageVisible: boolean = false;
  noticeData$:Observable<any>;
  token = JSON.parse(localStorage.getItem('token'));

  constructor() {
    super()
    this.mekaService.getUserData(this.token).pipe(takeUntil(this.onDestroyed$)).subscribe(user => {
      this.userData = user;
      this.mekaService.UserSubject.next(user);
    }, err => {
      this.notificationService.notify({ severity: 'error', summary: 'API Failure', detail: 'Failed to connect' })
    })
    this.noticeData$ = this.mekaService.getNotice(this.token)
    this.router.events.pipe(takeUntil(this.onDestroyed$)).subscribe((event) => {
      if (event instanceof NavigationStart) {
        this.isSidebarVisible = false;
      }
    })
  }

  signOut() {
    localStorage.clear()
    this.router.navigate(['login'])
  }

  showNotice() {
    this.isMessageVisible = true;
  }
}
