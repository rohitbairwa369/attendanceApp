import { Component} from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { NotificationService } from './service/notification.service';

import { NgxUiLoaderModule } from 'ngx-ui-loader';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { SPINNER } from 'ngx-ui-loader';
import { POSITION } from 'ngx-ui-loader';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet,HttpClientModule,ToastModule,NgxUiLoaderModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  providers: [DatePipe,HttpClient,MessageService,NotificationService,NgxUiLoaderService]
})
export class AppComponent {
  SPINNER;
  POSITION;

  constructor(){
    this.SPINNER = SPINNER;
    this.POSITION = POSITION;
  }

}
