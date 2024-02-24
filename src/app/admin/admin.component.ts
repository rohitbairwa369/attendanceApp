import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { TableModule } from 'primeng/table';
import { MekaService } from '../service/meka.service';
import { unsub } from '../shared/unsub.class';
import { takeUntil } from 'rxjs';
import { NotificationService } from '../service/notification.service';
import { InputTextModule } from 'primeng/inputtext';
import { Router } from '@angular/router';


@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule,TableModule,InputTextModule],
  providers: [MekaService,NotificationService],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.css'
})
export class AdminComponent extends unsub{

notificationService = inject(NotificationService)
router = inject(Router)
selectedUser:any;
usersData:any;
token = JSON.parse(localStorage.getItem('token'));
 constructor(private mekaService : MekaService){
  super()
  this.mekaService.getUsersData(this.token).pipe(takeUntil(this.onDestroyed$)).subscribe(user=>{
    this.usersData = user;
  },err=>{
    this.notificationService.notify({severity:'error', summary: 'API Failure', detail: 'Failed to connect', sticky: true})
  })
 }

 navigateToReport(id){
  this.router.navigate([`mreport/${id}`])
 }
}
