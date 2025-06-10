import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
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
  @Input() status: string = "חניכים";
@Input() codeProject:number=1;
  constructor(private api: ApiService, private snackBar: MatSnackBar) { }

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

  uploadFile() {
    if (!this.file) {
      this.snackBar.open('לא נבחר קובץ ', 'x', { duration: 1500 });
      return;
    }
    else {

      const formData = new FormData();
      formData.append('file', this.file, "fileuPLOWE");
      if(this.status=="חניכים"){
 this.api.uploadExcelFileStudents(formData).subscribe({
        next: res => {
          this.snackBar.open('קובץ החניכים הועלה בהצלחה', 'x', { duration: 1500 });
          this.close();
        },
        error: err => {
          this.snackBar.open('העלאה נכשלה', 'x', { duration: 1500 });
        }
      });
      }
      else{
         this.api.uploadExcelFileSharersForProject(formData,this.codeProject).subscribe({
        next: res => {
          this.snackBar.open('קובץ המשתתפים לפרויקט הועלה בהצלחה', 'x', { duration: 1500 });
          this.close();
        },
        error: err => {
          this.snackBar.open('העלאה נכשלה', 'x', { duration: 1500 });
        }
      });
      }
     
    }
  }
  downloadFile(): void {
    let fileName = ""
    if (this.status == "חניכים") {
      fileName = 'אקסל חניכים למילוי.xlsx';
    }
    else {
      fileName = 'אקסל משתתפים לפרויקט למילוי.xlsx';
    }
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
