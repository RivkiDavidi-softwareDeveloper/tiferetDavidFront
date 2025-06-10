import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddGuideForProjectComponent } from './add-guide-for-project.component';

describe('AddGuideForProjectComponent', () => {
  let component: AddGuideForProjectComponent;
  let fixture: ComponentFixture<AddGuideForProjectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddGuideForProjectComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AddGuideForProjectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
