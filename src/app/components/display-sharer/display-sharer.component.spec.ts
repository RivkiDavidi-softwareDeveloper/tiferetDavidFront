import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DisplaySharerComponent } from './display-sharer.component';

describe('DisplaySharerComponent', () => {
  let component: DisplaySharerComponent;
  let fixture: ComponentFixture<DisplaySharerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DisplaySharerComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DisplaySharerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
