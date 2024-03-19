import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { TableModule } from 'primeng/table';
import { MekaService } from '../service/meka.service';
import { unsub } from '../shared/unsub.class';
import { takeUntil } from 'rxjs';
import { NotificationService } from '../service/notification.service';
import { InputTextModule } from 'primeng/inputtext';
import { Router, RouterModule, RouterOutlet } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { SidebarModule } from 'primeng/sidebar';
import { AvatarModule } from 'primeng/avatar';
import { AvatarGroupModule } from 'primeng/avatargroup';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [RouterModule,ButtonModule,CommonModule,TableModule,InputTextModule,SidebarModule,RouterOutlet,AvatarModule,AvatarGroupModule],
  providers: [MekaService,NotificationService],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.css'
})
export class AdminComponent implements OnInit{
  isSidebarVisible: boolean = false;
router=inject(Router)
mekaService = inject(MekaService)
token = localStorage.getItem('token')
adminData:any;
constructor(){

}
ngOnInit(){
  this.mekaService.getUserData(this.token).subscribe(res=>{
    this.adminData = res;
    })
}
  logout(){
    localStorage.clear();
    this.router.navigate(['login'])
   }
}
