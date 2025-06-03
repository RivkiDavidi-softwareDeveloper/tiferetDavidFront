import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ExcelService } from '../../services/excel.service';
import { Student } from '../../models/student.class';
import { ApiService } from '../../services/api.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { error } from 'console';
import * as XLSX from 'xlsx';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-upload-file-excel',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './upload-file-excel.component.html',
  styleUrl: './upload-file-excel.component.scss'
})
export class UploadFileExcelComponent {
  @Input() popupDisplayIn: boolean = false;
  @Output() popupDisplayOut: EventEmitter<boolean> = new EventEmitter()


  constructor(private api: ApiService, private excelService: ExcelService, private snackBar: MatSnackBar) { }

  file: File | null = null;
  data: any[] = [];

  //כפתור הסגירה
  close() {
    this.popupDisplayOut.emit(false)
  }
  onFileSelected(event: any) {
    this.file = event.target.files[0];

    const file = event.target.files[0];
    const reader = new FileReader();
    reader.readAsDataURL(file);
    this.file = file
  }
  /*   onFileChange22222(event: any) {
      const target: DataTransfer = <DataTransfer>(event.target);
      if (target.files.length !== 1) throw new Error('Cannot use multiple files');
  
      this.file = target.files[0];
      const reader: FileReader = new FileReader();
      reader.onload = (e: any) => {
        const bstr: string = e.target.result;
        const wb: XLSX.WorkBook = XLSX.read(bstr, { type: 'binary' });
        const wsname: string = wb.SheetNames[0];
        const ws: XLSX.WorkSheet = wb.Sheets[wsname];
        this.data = <any>(XLSX.utils.sheet_to_json(ws, { header: 1 }));
      };
      reader.readAsBinaryString(this.file);
    } */


  /* 
    onFileChange(event: any) {
      const target: DataTransfer = <DataTransfer>(event.target);
      if (target.files.length !== 1) throw new Error('Cannot use multiple files');
  
      this.file = target.files[0];
      const reader: FileReader = new FileReader();
      reader.onload = (e: any) => {
        const bstr: string = e.target.result;
        const wb: XLSX.WorkBook = XLSX.read(bstr, { type: 'binary' });
        const wsname: string = wb.SheetNames[0];
        const ws: XLSX.WorkSheet = wb.Sheets[wsname];
        const jsonData: any[][] = XLSX.utils.sheet_to_json(ws, { header: 1 }) as any[][];
        this.data = jsonData.map((row: any[]) => row.slice(0, 39));
  
      };
      reader.readAsBinaryString(this.file);
    } */
  uploadFile() {
    if (!this.file) {
      this.snackBar.open('לא נבחר קובץ ', 'x', { duration: 1500 });
      return;
    }
    else {

      const formData = new FormData();
      formData.append('file', this.file, "fileuPLOWE");
      this.api.uploadExcelFile(formData).subscribe({
        next: res => {
          this.snackBar.open('קובץ החניכים הועלה בהצלחה', 'x', { duration: 1500 });
          this.close();
        },
        error: err => {
          this.snackBar.open('העלאה נכשלה', 'x', { duration: 1500 });
        }
      });
    }
  }
  downloadFile(): void {
    const fileName = 'אקסל חניכים למילוי.xlsx';
    const fileUrl = `assets/${fileName}`;
    const a = document.createElement('a');
    a.href = fileUrl;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }
  /* 
    constructor(private api: ApiService, private excelService: ExcelService, private snackBar: MatSnackBar) { }
  
    onFileChange(event: any) {
      const file = event.target.files[0];
      console.log("פעולה ראשונה");
      this.api.uploadExcelFile(file);
    } */
  //עברית



  /*  this.http.post('https://your-api-endpoint.com/upload', formData)
     .subscribe(response => {
       console.log('הקובץ הועלה בהצלחה');
     });
*/



  /*   // יצירת אובייקט FormData ריק
    const formData = new FormData();
    
    // הוספת הקובץ שנבחר לאובייקט ה-FormData
    formData.append('excelFile', file);
  
  
    this.selectedFile = event.target.files[0];
        // יצירת אובייקט FormData ריק
        const formData = new FormData();
      
        // הוספת הקובץ שנבחר לאובייקט ה-FormData
        formData.append('excelFile', file);
    
        // שליחת בקשת POST לשרת ה-Backend עם הקובץ שנבחר
        this.http.post('https://your-backend-url/api/upload-excel', formData)
          .subscribe(response => {
            console.log('הקובץ הועלה בהצלחה');
          }); */



}
