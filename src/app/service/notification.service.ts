import { EventEmitter, Injectable } from '@angular/core';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { MessageService } from 'primeng/api';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  constructor(private messageService: MessageService,private ngxLoader: NgxUiLoaderService) { }
  
  loaderSubject = new EventEmitter<boolean>();

  notify(message){
    this.messageService.add(message)
  }
  showLoader(){
    this.ngxLoader.start();
  }
  hideLoader(){
    this.ngxLoader.stop();
  }
}
