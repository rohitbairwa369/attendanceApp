import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageInternsComponent } from './manage-interns.component';

describe('ManageInternsComponent', () => {
  let component: ManageInternsComponent;
  let fixture: ComponentFixture<ManageInternsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ManageInternsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ManageInternsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
