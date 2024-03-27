import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { TableModule } from 'primeng/table';
import { MekaService } from '../service/meka.service';
import { NotificationService } from '../service/notification.service';
import { InputTextModule } from 'primeng/inputtext';
import { NavigationStart, Router, RouterModule, RouterOutlet } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { SidebarModule } from 'primeng/sidebar';
import { AvatarModule } from 'primeng/avatar';
import { AvatarGroupModule } from 'primeng/avatargroup';
import { unsub } from '../shared/unsub.class';
import { takeUntil } from 'rxjs';



@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [RouterModule,ButtonModule,CommonModule,TableModule,InputTextModule,SidebarModule,RouterOutlet,AvatarModule,AvatarGroupModule],
  providers: [MekaService,NotificationService],

  templateUrl: './admin.component.html',
  styleUrl: './admin.component.css'
})
export class AdminComponent extends unsub implements OnInit{
isSidebarVisible: boolean = false;
router=inject(Router)
mekaService = inject(MekaService)
adminData:any;
headerTitle:any;

ngOnInit(){
  const token = JSON.parse(localStorage.getItem('token'))
  this.mekaService.getUserData(token).pipe(takeUntil(this.onDestroyed$)).subscribe(res=>{
    this.adminData = res;
    this.mekaService.UserSubject.next(res);
    })
    let setheaderTitle = {
      "/admin/profile":"Profile",
      "/":"Home",
      "/admin":"Home",
      "/admin/add-interns":"Add Interns",
      "/admin/notice":"Notice",
      "/admin/add-holidays":"Add Holidays"
    }
    this.headerTitle= setheaderTitle[window.location.pathname]
    if(window.location.pathname.includes('mreport')){
      this.headerTitle= "Monthly Report"
    }
  this.router.events.pipe(takeUntil(this.onDestroyed$)).subscribe((event) => {
      if (event instanceof NavigationStart) {
        this.isSidebarVisible = false;
        this.headerTitle = setheaderTitle[event.url]
        if(event.url.includes('mreport')){
          this.headerTitle= "Monthly Report"
        }
      }
    })
    this.mekaService.UpdatePic.subscribe((update=>{
      this.adminData.profilePic = update;
    }))
}
  logout(){
    localStorage.clear();
    this.router.navigate(['login'])
   }
}

