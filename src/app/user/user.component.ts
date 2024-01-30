import { Component, OnDestroy, inject } from '@angular/core';
import { NavigationStart, Router, RouterModule } from '@angular/router';
import { AvatarModule } from 'primeng/avatar';
import { SidebarModule } from 'primeng/sidebar';
import { MekaService } from '../service/meka.service';
import { NotificationService } from '../service/notification.service';
import { DialogModule } from 'primeng/dialog';
import { CommonModule } from '@angular/common';
import { BadgeModule } from 'primeng/badge';
import { Subscription } from 'rxjs';
@Component({
  selector: 'app-user',
  standalone: true,
  imports: [RouterModule,SidebarModule,AvatarModule,DialogModule,CommonModule, BadgeModule],
  templateUrl: './user.component.html',
  styleUrl: './user.component.css',
  providers: [MekaService,NotificationService]
})
export class UserComponent implements OnDestroy{
  mekaService= inject(MekaService);
  notificationService = inject(NotificationService)
  router = inject(Router)
  userData: any={};
  isSidebarVisible:boolean= false;
  isMessageVisible:boolean=false;
  noticeData:any={};
  token = JSON.parse(localStorage.getItem('token'));
  private UserDataSubscription: Subscription;
constructor(){
  this.UserDataSubscription = this.mekaService.getUserData(this.token).subscribe(user=>{
    this.userData = user;
    this.mekaService.UserSubject.next(user);
  },err=>{
    this.notificationService.notify({severity:'error', summary: 'API Failure', detail: 'Failed to connect'})
  })
  this.UserDataSubscription.add(this.mekaService.getNotice(this.token).subscribe(notice=>{
    this.noticeData=notice;
  },err=>{
    this.notificationService.notify({severity:'error', summary: 'API Failure', detail: 'Failed to connect'})
  }))
  this.UserDataSubscription.add(this.router.events.subscribe((event) => {
    if (event instanceof NavigationStart) {
      this.isSidebarVisible = false;
    }
  }))
}
  ngOnDestroy(): void {
    this.UserDataSubscription.unsubscribe()
  }

signOut(){
  localStorage.clear()
  this.router.navigate(['login'])
}

showNotice(){
  this.isMessageVisible=true;
}
}
