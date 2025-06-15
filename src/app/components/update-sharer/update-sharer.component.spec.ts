import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateSharerComponent } from './update-sharer.component';

describe('UpdateSharerComponent', () => {
  let component: UpdateSharerComponent;
  let fixture: ComponentFixture<UpdateSharerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UpdateSharerComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(UpdateSharerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
