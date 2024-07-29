import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActivityReportingComponent } from './activity-reporting.component';

describe('ActivityReportingComponent', () => {
  let component: ActivityReportingComponent;
  let fixture: ComponentFixture<ActivityReportingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ActivityReportingComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ActivityReportingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
