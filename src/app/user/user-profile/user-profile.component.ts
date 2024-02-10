import { Component } from '@angular/core';
import { MekaService } from '../../service/meka.service';
import { CommonModule } from '@angular/common';
import { SkeletonModule } from 'primeng/skeleton';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { InputTextModule } from 'primeng/inputtext';
import { takeUntil } from 'rxjs';
import { unsub } from '../../shared/unsub.class';
import { NotificationService } from '../../service/notification.service';
@Component({
  selector: 'app-user-profile',
  standalone: true,
  imports: [CommonModule,SkeletonModule,ReactiveFormsModule,InputTextModule],
  templateUrl: './user-profile.component.html',
  styleUrl: './user-profile.component.css'
})
export class UserProfileComponent extends unsub {
  userData: any={};
  profileForm:FormGroup;
  imageUrl: SafeResourceUrl;
  selectedFile: any;
  token = JSON.parse(localStorage.getItem('token'));
  constructor(private mekaService:MekaService,private sanitizer: DomSanitizer,private notify : NotificationService){
    super()
    this.mekaService.myUserData$.pipe(takeUntil(this.onDestroyed$)).subscribe(data=>{
      this.userData = data;
      this.imageUrl = this.userData.profilePic;
      this.profileForm=new FormGroup({
        'name':new FormControl(this.userData.name,Validators.required),
        'email': new FormControl(this.userData.email,Validators.required),
        'password':new FormControl(this.userData.password,Validators.required),
        'mobile_number':new FormControl(this.userData.mobile,[Validators.required]),
        'location':new FormControl(this.userData.location,Validators.required),
        'pin':new FormControl(this.userData.pin,Validators.required),
        'company':new FormControl(this.userData.company_name,Validators.required)
    
      })
    })
  }

  OnSave(){
    if(this.imageUrl.hasOwnProperty('changingThisBreaksApplicationSecurity')){
      const updatedProfile ={'profilePic' :this.imageUrl['changingThisBreaksApplicationSecurity']}
      // this.mekaService.UpdatePic.emit(this.imageUrl);
      this.mekaService.updateUserDataApi(this.token,updatedProfile).subscribe(res=>{
        this.notify.notify({severity:'success', summary:'Image Uploaded', detail: "Success"});
      })
    }  
}

onFileSelected(event: any) {
  this.selectedFile = event.target.files[0];
  if (this.selectedFile) {
    const reader = new FileReader();
    reader.onload = (event: any) => {
      this.imageUrl = this.sanitizer.bypassSecurityTrustResourceUrl(event.target.result);
    };
    reader.readAsDataURL(this.selectedFile);
  }
}
}
