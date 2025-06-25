import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GaugeComponentComponent } from './gauge-component.component';

describe('GaugeComponentComponent', () => {
  let component: GaugeComponentComponent;
  let fixture: ComponentFixture<GaugeComponentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GaugeComponentComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(GaugeComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
