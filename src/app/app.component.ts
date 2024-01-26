import { Component } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet,HttpClientModule,ToastModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  providers: [DatePipe,HttpClient,MessageService]
})
export class AppComponent {
  title = 'attendanceApp';
}
