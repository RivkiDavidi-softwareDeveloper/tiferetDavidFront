import { Component, Input } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-file-upload',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './file-upload.component.html',
  styleUrl: './file-upload.component.scss'
})

export class FileUploadComponent {
  selectedFiles: FileList | undefined;
  //תיקית השורש: פעילויות /חניכים/פעילים
  @Input() folder = "students"
  //קוד הפעילות/החניך/הפעיל
  @Input() newFolderCode = 8000
  constructor(private api: ApiService) { }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files) {
      this.selectedFiles = input.files;
    }
  }

  onUpload() {
    if (this.selectedFiles) {
      const formData = new FormData();
      for (let i = 0; i < this.selectedFiles.length; i++) {
        formData.append('files', this.selectedFiles[i], this.selectedFiles[i].name);
      }
      this.api.FilesUpload(this.folder, this.newFolderCode, formData)
        .subscribe(response => {
          console.log('Files uploaded successfully', response);
        }, error => {
          console.error('Error uploading files', error);
        });
    }
  }
  formatFileSize(size: number): string {
    if (size === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(size) / Math.log(k));
    return parseFloat((size / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }
  //ממיר למערך
  f(selectedFiles: FileList) {
    let filesArray: File[] = Array.from(selectedFiles);
    return filesArray;
  }
  // בתוך כיתת ה- FileUploadComponent שלך

  getFileIcon(file: File): string {
    const extension = this.getFileExtension(file.name);
    switch (extension.toLowerCase()) {
      case 'xlsx':
      case 'xls':
        return 'excel-icon-class'; // להחליף במחלקת CSS אמיתית עבור סמלי Excel
      case 'docx':
      case 'doc':
        return 'word-icon-class'; // להחליף במחלקת CSS אמיתית עבור סמלי Word
      case 'pdf':
        return 'pdf-icon-class'; // להחליף במחלקת CSS אמיתית עבור סמלי PDF
      case 'jpg':
      case 'jpeg':
      case 'png':
      case 'gif':
        return 'image-icon-class'; // להחליף במחלקת CSS אמיתית עבור סמלי תמונה
      // להוסיף עוד מקרים לסוגי קבצים שונים בהתאם לצורך
      default:
        return 'default-file-icon-class'; // מחלקת סמל ברירת מחדל לסוגי קבצים שאינם ידועים
    }
  }

   getFileExtension(filename: string): string {
    return filename.split('.').pop()!.toLowerCase();
  }

}



