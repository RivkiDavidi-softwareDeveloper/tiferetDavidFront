import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkerInquiriesComponent } from './worker-inquiries.component';

describe('WorkerInquiriesComponent', () => {
  let component: WorkerInquiriesComponent;
  let fixture: ComponentFixture<WorkerInquiriesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WorkerInquiriesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(WorkerInquiriesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
