import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { MekaService } from '../service/meka.service';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NotificationService } from '../service/notification.service';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { take } from 'rxjs';
@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule,ProgressSpinnerModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
  providers: [MekaService,NotificationService]
})
export class LoginComponent {
  router=inject(Router)
  notificationService = inject(NotificationService)
  mekaService = inject(MekaService)
  showPassword: boolean = false;
  ptype: string = "password";

  loginForm:FormGroup;
  isLoading: boolean=false;
  
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
      this.isLoading = true;
      const credentials = this.loginForm.value;
      this.mekaService.userLogin(credentials).pipe(take(1)).subscribe(res=>{
        if(res['auth']){
          this.isLoading = false;
          localStorage.setItem('token',JSON.stringify(res))
            this.loginForm.reset();
            if(res['role']=='admin'){
              this.router.navigate(['admin'])
            }else{
            this.router.navigate(['dashboard']);
            }
        }else{
          this.isLoading = false;
          this.notificationService.notify({ severity: 'error', summary: 'Authentication Failed', detail: res['token'], life: 3000 });
        }
      },err=>{
        this.notificationService.notify({ severity: 'error', summary: 'Authentication Failed', detail: err.message, life: 3000 });
        this.isLoading = false;
      })

    }else{
      this.isLoading = false;
      this.notificationService.notify({ severity: 'info', summary: 'Invalid Form', detail: 'Response is empty or invalid', life: 3000 });
    }
  }


  constructor(){
    this.loginForm=new FormGroup({
      'email': new FormControl(null,[Validators.email,Validators.required]),
      'password':new FormControl(null,Validators.required)
    })
  }

}
