import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MekaService } from '../../service/meka.service';
import { NotificationService } from '../../service/notification.service';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { RadioButtonModule } from 'primeng/radiobutton';

@Component({
  selector: 'app-add-interns',
  standalone: true,
  imports: [CommonModule,ReactiveFormsModule,InputTextModule,ButtonModule,RadioButtonModule],
  templateUrl: './add-interns.component.html',
  styleUrl: './add-interns.component.css'
})
export class AddInternsComponent {
  registrationForm: FormGroup;
  @Output() newInternAdded = new EventEmitter<boolean>();

  constructor(private fb: FormBuilder,private mekaService:MekaService,private notify:NotificationService) { }

  ngOnInit(): void {
    this.registrationForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      name: ['', Validators.required],
      gender: ['', Validators.required]
    });
  }

  onSubmit() {
    if (this.registrationForm.valid) {
      this.notify.showLoader()
      const token = JSON.parse(localStorage.getItem('token'))
      this.mekaService.userRegister(this.registrationForm.value,token).subscribe(response=>{
        if(response['errorMessage']){
          this.notify.notify({severity:'error', summary: 'Aborted', detail: response['errorMessage'], life: 3000 })
          this.notify.hideLoader()
        }else{
          this.notify.notify({severity:'success', summary: 'Success', detail: 'User Added', life: 3000 })
          this.newInternAdded.emit(true);
          this.registrationForm.reset()
          this.notify.hideLoader()
        }
      },err=>{
        this.notify.notify({severity:'error', summary: 'Aborted', detail: 'Something went wrong!', life: 3000 })
      })
    } else {
      console.log('Form is invalid');
    }
  }
}
