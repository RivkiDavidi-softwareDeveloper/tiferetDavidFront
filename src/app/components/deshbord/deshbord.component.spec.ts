import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeshbordComponent } from './deshbord.component';

describe('DeshbordComponent', () => {
  let component: DeshbordComponent;
  let fixture: ComponentFixture<DeshbordComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DeshbordComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DeshbordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
