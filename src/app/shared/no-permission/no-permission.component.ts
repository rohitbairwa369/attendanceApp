import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
@Component({
  selector: 'app-no-permission',
  standalone: true,
  imports: [ButtonModule],
  templateUrl: './no-permission.component.html',
  styleUrl: './no-permission.component.css'
})
export class NoPermissionComponent {

  constructor(private router :Router){

  }

  backTohome(){
this.router.navigate(['login'])
  }
}
