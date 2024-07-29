import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddUpdateWorkerComponent } from './add-update-worker.component';

describe('AddUpdateWorkerComponent', () => {
  let component: AddUpdateWorkerComponent;
  let fixture: ComponentFixture<AddUpdateWorkerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddUpdateWorkerComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AddUpdateWorkerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
