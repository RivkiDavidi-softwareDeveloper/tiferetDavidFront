import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UploadFileExcelComponent } from './upload-file-excel.component';

describe('UploadFileExcelComponent', () => {
  let component: UploadFileExcelComponent;
  let fixture: ComponentFixture<UploadFileExcelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UploadFileExcelComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(UploadFileExcelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
