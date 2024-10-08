import { Component, OnInit } from '@angular/core';
import { TableModule } from 'primeng/table';
import { MekaService } from '../../service/meka.service';
import { TooltipModule } from 'primeng/tooltip';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';
import { ConfirmationService} from 'primeng/api';
import { NotificationService } from '../../service/notification.service';
import { SidebarModule } from 'primeng/sidebar';
import { AddInternsComponent } from "../add-interns/add-interns.component";
import { InputTextModule } from 'primeng/inputtext';

@Component({
    selector: 'app-manage-interns',
    standalone: true,
    providers: [
        MekaService,
        ConfirmationService,
    ],
    templateUrl: './manage-interns.component.html',
    imports: [
        TableModule,
        TooltipModule,
        ConfirmDialogModule,
        ToastModule,
        SidebarModule,
        AddInternsComponent,
        InputTextModule
    ]
})
export class ManageInternsComponent implements OnInit {

  token = JSON.parse(localStorage.getItem('token'))
  IsSidebarVisible:boolean=false;
  constructor(
    private mekaService: MekaService,
    private confirmationService: ConfirmationService,
    private notify:NotificationService
  ) {}
  allInternsList: any;
  ngOnInit(): void {
    this.notify.showLoader()
    const token = JSON.parse(localStorage.getItem('token'));
    this.mekaService.getUsersData(token).subscribe((res: any) => {
      this.allInternsList = res;
      this.notify.hideLoader()
    });
  }

  internAdded(event){
    this.notify.showLoader()
    const token = JSON.parse(localStorage.getItem('token'));
    this.mekaService.getUsersData(token).subscribe((res: any) => {
      this.allInternsList = res;
      this.notify.hideLoader()
    });
  }
  deleteUser(user) {
    let userIndex = this.allInternsList.findIndex(item=>{
      return item._id == user._id
    })
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: 'Do you want to delete this record?',
      header: 'Delete Confirmation',
      icon: 'pi pi-info-circle',
      acceptButtonStyleClass: 'p-button-danger p-button-text',
      rejectButtonStyleClass: 'p-button-text p-button-text',
      acceptIcon: 'none',
      rejectIcon: 'none',
      accept: () => {
      this.mekaService.deleteUser(this.token,user._id).subscribe(res=>{
        this.allInternsList.splice(userIndex,1)
        this.notify.notify({severity:'success', summary: 'Success', detail: res['message'], life: 3000 })
      },error=>{
        this.notify.notify({severity:'error', summary: 'Error', detail: 'Failed to delete record!', life: 3000 })
      })
      }
    });
  }
}
