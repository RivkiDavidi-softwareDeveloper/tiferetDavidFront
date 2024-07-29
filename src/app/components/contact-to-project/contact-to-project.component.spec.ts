import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContactToProjectComponent } from './contact-to-project.component';

describe('ContactToProjectComponent', () => {
  let component: ContactToProjectComponent;
  let fixture: ComponentFixture<ContactToProjectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ContactToProjectComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ContactToProjectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
