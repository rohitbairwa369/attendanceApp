import { Component } from '@angular/core';
import { FormGroup, FormsModule,FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { SafeResourceUrl, DomSanitizer, Title } from '@angular/platform-browser';
import { takeUntil } from 'rxjs';
import { MekaService } from '../../service/meka.service';
import { NotificationService } from '../../service/notification.service';
import { unsub } from '../../shared/unsub.class';
import { CommonModule } from '@angular/common';
import { CalendarModule } from 'primeng/calendar';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { RadioButtonModule } from 'primeng/radiobutton';
import { SkeletonModule } from 'primeng/skeleton';

@Component({
  selector: 'app-admin-profile',
  standalone: true,
  imports: [CommonModule,SkeletonModule,ReactiveFormsModule,InputTextModule,CalendarModule,RadioButtonModule,FormsModule,InputTextareaModule],
  templateUrl: './admin-profile.component.html',
  styleUrl: './admin-profile.component.css'
})
export class AdminProfileComponent extends unsub {
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
      const updatedProfile ={
        'profilePic' :this.imageUrl['changingThisBreaksApplicationSecurity'],
        ...this.profileForm.value
      }
      if(this.imageUrl['changingThisBreaksApplicationSecurity']){
        this.mekaService.UpdatePic.emit(this.imageUrl['changingThisBreaksApplicationSecurity']);
      }
      this.mekaService.updateUserDataApi(this.token,updatedProfile).subscribe(res=>{
        this.isloading=false;
        this.notify.notify({severity:'success', summary:'Profile Updated', detail: "Success"});
      },error=>{
        this.isloading=false;
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
