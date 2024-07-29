import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CitysimpleComponent } from './citysimple.component';

describe('CitysimpleComponent', () => {
  let component: CitysimpleComponent;
  let fixture: ComponentFixture<CitysimpleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CitysimpleComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CitysimpleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
