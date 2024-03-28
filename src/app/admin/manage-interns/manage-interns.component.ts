import { Component, OnInit } from '@angular/core';
import { TableModule } from 'primeng/table';
import { MekaService } from '../../service/meka.service';
import { TooltipModule } from 'primeng/tooltip';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';
import { ConfirmationService, MessageService } from 'primeng/api';
import { NgxUiLoaderModule } from 'ngx-ui-loader';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { SPINNER } from 'ngx-ui-loader';
import { POSITION } from 'ngx-ui-loader';
@Component({
  selector: 'app-manage-interns',
  standalone: true,
  imports: [
    TableModule,
    TooltipModule,
    ConfirmDialogModule,
    ToastModule,
    NgxUiLoaderModule,
  ],
  providers: [
    MekaService,
    ConfirmationService,
    MessageService,
    NgxUiLoaderService,
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
    private messageService: MessageService,
    private ngxLoader: NgxUiLoaderService
  ) {
    this.SPINNER = SPINNER;
    this.POSITION = POSITION;
  }
  allInternsList: any;
  ngOnInit(): void {
    this.ngxLoader.start();
    const token = JSON.parse(localStorage.getItem('token'));
    this.mekaService.getUsersData(token).subscribe((res: any) => {
      this.allInternsList = res;
     this.ngxLoader.stop();
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
        this.messageService.add({
          severity: 'info',
          summary: 'Confirmed',
          detail: 'Record deleted',
        });
      },
      reject: () => {
        this.messageService.add({
          severity: 'error',
          summary: 'Rejected',
          detail: 'You have rejected',
        });
      },
    });
  }
}
