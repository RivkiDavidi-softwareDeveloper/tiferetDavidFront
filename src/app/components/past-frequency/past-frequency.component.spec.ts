import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PastFrequencyComponent } from './past-frequency.component';

describe('PastFrequencyComponent', () => {
  let component: PastFrequencyComponent;
  let fixture: ComponentFixture<PastFrequencyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PastFrequencyComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PastFrequencyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
