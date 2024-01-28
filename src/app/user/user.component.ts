import { Component, inject } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { AvatarModule } from 'primeng/avatar';
import { SidebarModule } from 'primeng/sidebar';
import { MekaService } from '../service/meka.service';
import { NotificationService } from '../service/notification.service';
import { DialogModule } from 'primeng/dialog';
import { CommonModule } from '@angular/common';
import { BadgeModule } from 'primeng/badge';
@Component({
  selector: 'app-user',
  standalone: true,
  imports: [RouterModule,SidebarModule,AvatarModule,DialogModule,CommonModule, BadgeModule],
  templateUrl: './user.component.html',
  styleUrl: './user.component.css',
  providers: [MekaService,NotificationService]
})
export class UserComponent {
  mekaService= inject(MekaService);
  notificationService = inject(NotificationService)
  router = inject(Router)
  userData: any={};
  isSidebarVisible:boolean= false;
  isMessageVisible:boolean=false;
  noticeData:any={};
constructor(){
  this.mekaService.getUserData().subscribe(user=>{
    this.userData = user;
  },err=>{
    this.notificationService.notify({severity:'error', summary: 'API Failure', detail: 'Failed to connect'})
  })
  this.mekaService.getNotice().subscribe(notice=>{
    this.noticeData=notice;
  },err=>{
    this.notificationService.notify({severity:'error', summary: 'API Failure', detail: 'Failed to connect'})
  })
}

signOut(){
  localStorage.clear()
  this.router.navigate(['login'])
}

showNotice(){
  this.isMessageVisible=true;
}
}
