import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddStudentForProjectComponent } from './add-student-for-project.component';

describe('AddStudentForProjectComponent', () => {
  let component: AddStudentForProjectComponent;
  let fixture: ComponentFixture<AddStudentForProjectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddStudentForProjectComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AddStudentForProjectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
