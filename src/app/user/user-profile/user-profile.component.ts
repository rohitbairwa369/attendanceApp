import { Component } from '@angular/core';
import { MekaService } from '../../service/meka.service';
import { CommonModule } from '@angular/common';
import { SkeletonModule } from 'primeng/skeleton';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators,FormsModule } from '@angular/forms';
import { DomSanitizer, SafeResourceUrl, Title } from '@angular/platform-browser';
import { InputTextModule } from 'primeng/inputtext';
import { takeUntil } from 'rxjs';
import { unsub } from '../../shared/unsub.class';
import { NotificationService } from '../../service/notification.service';
import { CalendarModule } from 'primeng/calendar';
import { RadioButtonModule } from 'primeng/radiobutton';
import { InputTextareaModule } from 'primeng/inputtextarea';
@Component({
  selector: 'app-user-profile',
  standalone: true,
  imports: [CommonModule,SkeletonModule,ReactiveFormsModule,InputTextModule,CalendarModule,RadioButtonModule,FormsModule,InputTextareaModule],
  templateUrl: './user-profile.component.html',
  styleUrl: './user-profile.component.css'
})
export class UserProfileComponent extends unsub {
  userData: any={};
  profileForm!:FormGroup;
  imageUrl: SafeResourceUrl;
  selectedFile: any;
  token = JSON.parse(localStorage.getItem('token'));
  isloading:boolean=false;
  constructor(private titleService: Title,private mekaService:MekaService,private sanitizer: DomSanitizer,private notify : NotificationService, private FormBuilder: FormBuilder){
    super()
    this.titleService.setTitle("Meka - Profile")
    this.mekaService.myUserData$.pipe(takeUntil(this.onDestroyed$)).subscribe(data=>{
      this.userData = data;
      this.imageUrl = this.userData.profilePic;
      
      this.profileForm=this.FormBuilder.group({
        name: [this.userData.name, [Validators.required]],
        email: [this.userData.email, [Validators.required, Validators.email]],
        gender: [this.userData.gender, [Validators.required]],
        role: [this.userData.role, [Validators.required]],
        designation:[this.userData.designation, [Validators.required]],
        contact:[
          this.userData.contact,
          [
            Validators.required,
            Validators.pattern('^[0-9]{2,30}$'),
            Validators.minLength(10),
            Validators.maxLength(10)
          ],
        ],
        birthDate: [new Date(this.userData.birthDate), [Validators.required]],
        reportingTo: [this.userData.reportingTo, [Validators.required]],
        teamCategory: [this.userData.teamCategory, [Validators.required]],
        address: [this.userData.address, [Validators.required]],   
      })
      this.profileForm.get('role').disable(); 
    })
  }

  OnSave(){
    this.isloading=true;
    this.notify.showLoader()
      const updatedProfile ={
        'profilePic' :this.imageUrl['changingThisBreaksApplicationSecurity'],
        ...this.profileForm.value
      }
      if(this.imageUrl['changingThisBreaksApplicationSecurity']){
        this.mekaService.UpdatePic.emit(this.imageUrl['changingThisBreaksApplicationSecurity']);
      }
      this.mekaService.updateUserDataApi(this.token,updatedProfile).subscribe(res=>{
        this.isloading=false;
        this.notify.hideLoader()
        this.notify.notify({severity:'success', summary:'Profile Updated', detail: "Success"});
      },error=>{
        this.isloading=false;
        this.notify.hideLoader()
        this.notify.notify({severity:'error', summary:'Updating Profile Failed', detail: "Failed"});
      })
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
