import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { MekaService } from '../service/meka.service';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
  providers: [MekaService]
})
export class LoginComponent {
  router=inject(Router)
  mekaService = inject(MekaService)
  showPassword: boolean = false;
  ptype: string = "password";

  loginForm:FormGroup;
  
  passwordAction(){
    this.showPassword= !this.showPassword;
    if(this.showPassword){
      this.ptype = 'text';

    }else{
      this.ptype = "password";
    }
  }

  empLogin(){
    if(this.loginForm.valid){
      const credentials = this.loginForm.value;
      this.mekaService.userLogin(credentials).subscribe(res=>{
        if(res['auth']){
          localStorage.setItem('token',JSON.stringify(res))
            this.loginForm.reset();
            this.router.navigate(['dashboard']);
        }
      },err=>{
        console.log(err);
      })

    }
  }


  constructor(){
    this.loginForm=new FormGroup({
      'email': new FormControl(null,[Validators.email,Validators.required]),
      'password':new FormControl(null,Validators.required)
    })
  }

}
