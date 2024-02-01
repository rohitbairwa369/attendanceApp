import { Component } from '@angular/core';
import { MekaService } from '../../service/meka.service';
import { Observable } from 'rxjs';
import { AvatarModule } from 'primeng/avatar';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-notice',
  standalone: true,
  imports: [CommonModule,AvatarModule],
  templateUrl: './notice.component.html',
  styleUrl: './notice.component.css'
})
export class NoticeComponent {
noticeData$: Observable<any>;

token = JSON.parse(localStorage.getItem('token'));
constructor(private mekaService:MekaService){
  this.noticeData$ = this.mekaService.getNotice(this.token)
}

}
