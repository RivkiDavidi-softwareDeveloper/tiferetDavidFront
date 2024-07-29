import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DistanceTrackerComponent } from './distance-tracker.component';

describe('DistanceTrackerComponent', () => {
  let component: DistanceTrackerComponent;
  let fixture: ComponentFixture<DistanceTrackerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DistanceTrackerComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DistanceTrackerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
