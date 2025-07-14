import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActivityReportingForStudentComponent } from './activity-reporting-for-student.component';

describe('ActivityReportingForStudentComponent', () => {
  let component: ActivityReportingForStudentComponent;
  let fixture: ComponentFixture<ActivityReportingForStudentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ActivityReportingForStudentComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ActivityReportingForStudentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
