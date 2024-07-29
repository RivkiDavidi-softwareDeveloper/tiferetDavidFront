import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DisplayStudentsComponent } from './display-students.component';

describe('DisplayStudentsComponent', () => {
  let component: DisplayStudentsComponent;
  let fixture: ComponentFixture<DisplayStudentsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DisplayStudentsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DisplayStudentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
