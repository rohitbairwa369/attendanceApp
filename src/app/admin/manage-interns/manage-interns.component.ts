import { Component, OnInit } from '@angular/core';
import { TableModule } from 'primeng/table';
import { MekaService } from '../../service/meka.service';
import { TooltipModule } from 'primeng/tooltip';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';
import { ConfirmationService} from 'primeng/api';
import { NotificationService } from '../../service/notification.service';
@Component({
  selector: 'app-manage-interns',
  standalone: true,
  imports: [
    TableModule,
    TooltipModule,
    ConfirmDialogModule,
    ToastModule,
  ],
  providers: [
    MekaService,
    ConfirmationService,
  ],
  templateUrl: './manage-interns.component.html',

})
export class ManageInternsComponent implements OnInit {
  SPINNER;
  POSITION;
  text = 'Loading...';
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

  deleteUser(user, event) {
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
      this.notify.notify({severity:'success', summary: 'Success', detail: 'Record deleted successfully!', life: 3000 })
      },
      reject: () => {
    this.notify.notify({severity:'error', summary: 'Aborted', detail: 'You have rejected!', life: 3000 })
      },
    });
  }
}
