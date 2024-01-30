import { EventEmitter, Injectable } from '@angular/core';
import { MessageService } from 'primeng/api';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  constructor(private messageService: MessageService) { }
  
  loaderSubject = new EventEmitter<boolean>();


  showLoader() {
    this.loaderSubject.emit(true);
  }
  hideLoader() {
    this.loaderSubject.emit(false);
  }
  notify(message){
    this.messageService.add(message)
  }
}
