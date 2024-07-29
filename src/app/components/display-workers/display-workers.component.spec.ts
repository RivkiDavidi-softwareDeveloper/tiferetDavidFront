import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DisplayWorkersComponent } from './display-workers.component';

describe('DisplayWorkersComponent', () => {
  let component: DisplayWorkersComponent;
  let fixture: ComponentFixture<DisplayWorkersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DisplayWorkersComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DisplayWorkersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
