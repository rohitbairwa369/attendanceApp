import { Component } from '@angular/core';
import { MekaService } from '../../service/meka.service';
import { CommonModule } from '@angular/common';
import { SkeletonModule } from 'primeng/skeleton';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { InputTextModule } from 'primeng/inputtext';
@Component({
  selector: 'app-user-profile',
  standalone: true,
  imports: [CommonModule,SkeletonModule,ReactiveFormsModule,InputTextModule],
  templateUrl: './user-profile.component.html',
  styleUrl: './user-profile.component.css'
})
export class UserProfileComponent {
  userData: any={};
  profileForm:FormGroup;
  imageUrl: SafeResourceUrl;
  selectedFile: any;
  constructor(private mekaService:MekaService,private sanitizer: DomSanitizer,){
    this.mekaService.myUserData$.subscribe(data=>{
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
    const updatedProfile={
      name:this.profileForm.get('name').value,
      email:this.profileForm.get('email').value,
      password:this.profileForm.get('password').value,
      mobile:this.profileForm.get('mobile_number').value,
      location:this.profileForm.get('location').value,
      pin:this.profileForm.get('pin').value,
      company_name:this.profileForm.get('company').value
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
    // const updatedProfile ={profilePic :this.imageUrl['changingThisBreaksApplicationSecurity']}
    // this.testserivce.UpdatePic.emit(this.imageUrl);
    // this.testserivce.UpDateAdminProfile({profilePic :this.imageUrl['changingThisBreaksApplicationSecurity']},this.token).subscribe(res=>{
    //   this.messageService.add({severity:'success', summary:'Image Uploaded', detail: "Success"});
    // })
  }
}
}
