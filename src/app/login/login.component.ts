import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  router=inject(Router)
  showPassword: boolean = false;
  ptype: string = "password";
  passwordAction(){
    this.showPassword= !this.showPassword;
    if(this.showPassword){
      this.ptype = 'text';

    }else{
      this.ptype = "password";
    }
  }

  empLogin(){
   this.router.navigate(['dashboard']);
  }
}
