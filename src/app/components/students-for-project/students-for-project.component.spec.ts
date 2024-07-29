import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StudentsForProjectComponent } from './students-for-project.component';

describe('StudentsForProjectComponent', () => {
  let component: StudentsForProjectComponent;
  let fixture: ComponentFixture<StudentsForProjectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StudentsForProjectComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(StudentsForProjectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
