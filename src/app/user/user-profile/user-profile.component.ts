import { Component } from '@angular/core';
import { MekaService } from '../../service/meka.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-user-profile',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './user-profile.component.html',
  styleUrl: './user-profile.component.css'
})
export class UserProfileComponent {
  user: any={};
  constructor(private mekaService:MekaService){
    this.mekaService.myUserData$.subscribe(data=>{
      this.user = data;
    })
  }

}
