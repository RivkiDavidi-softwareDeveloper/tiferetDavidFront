import { Component, EventEmitter, Input, Output, AfterViewInit, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Worker } from '../../models/worker.class';
import { ApiService } from '../../services/api.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Project } from '../../models/project.class';

@Component({
  selector: 'app-new-project',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './new-project.component.html',
  styleUrl: './new-project.component.scss'

})
export class NewProjectComponent {
  @Input() status: string = 'add';
  @Input() popupDisplayIn: boolean = false;
  @Input() projectUpdate: Project = new Project(1, "", "", "", "", "", 1)


  @Output() popupDisplayOut: EventEmitter<boolean> = new EventEmitter()
  cb1: boolean = true;
  cb2: boolean = false;

  Pr_name = ""
  Pr_content = ""
  Pr_description = ""
  Pr_Place = ""
  Pr_date = ""
  Pr_gender = 1

  validPr_name: boolean = false;
  validPr_content: boolean = false;
  validPr_description: boolean = false;
  validPr_Place: boolean = false;
  validPr_date: boolean = false;


  //קונסטרקטור
  constructor(private api: ApiService, private snackBar: MatSnackBar) {
  }
  //סגירת הפופפ
  public close(): void {
    this.popupDisplayOut.emit(false)
  }
  //בדיקות תקינות
  isNumeric(input: string): boolean {
    const numericRegex: RegExp = /^\d+$/;
    return numericRegex.test(input);
  }
  //קליטת ערכים מתוך הינפוטים
  //שם
  onInputChangeName(event: Event) {
    const name: string = (event.target as HTMLInputElement).value
    if (name.length <= 40) {
      this.Pr_name = name;
      this.validPr_name = false;
    }
    else {
      this.validPr_name = true;
    }
  }
  //תוכן
  onInputChangeContent(event: Event) {
    const name: string = (event.target as HTMLInputElement).value
    if (name.length <= 100) {
      this.Pr_content = name;
      this.validPr_content = false;
    }
    else {
      this.validPr_content = true;
    }
  }
  //תאור
  onInputChangeDescription(event: Event) {
    const name: string = (event.target as HTMLInputElement).value
    if (name.length <= 500) {
      this.Pr_description = name;
      this.validPr_description = false;
    }
    else {
      this.validPr_description = true;
    }
  }
  //מקום
  onInputChangePlace(event: Event) {
    const name: string = (event.target as HTMLInputElement).value
    if (name.length <= 50) {
      this.Pr_Place = name;
      this.validPr_Place = false;
    }
    else {
      this.validPr_Place = true;
    }
  }
  //תאריך
  onInputChangeDate(event: Event) {
    const name: string = (event.target as HTMLInputElement).value
    if (name.length == 10) {
      this.Pr_date = name;
      this.validPr_date = false;
    }
    else {
      this.validPr_date = true;
    }
  }



  //בודקת את תקינות כל הינפוטים
  validation(): boolean {

    return !this.validPr_name && !this.validPr_content && !this.validPr_description && !this.validPr_Place && !this.validPr_date &&
      this.Pr_name.length > 0 && this.Pr_content.length > 0 && this.Pr_description.length > 0 && this.Pr_Place.length > 0 && this.Pr_date.length > 0;
  }
  validation2(): boolean {
    return !this.validPr_name && !this.validPr_content && !this.validPr_description && !this.validPr_Place && !this.validPr_date
  }
  //הוספה
  public async add(): Promise<void> {
    if (this.validation()) {
      if (this.cb1) {
        this.Pr_gender = 1;
      }
      else {
        this.Pr_gender = 2
      }
      const addProject: Project = new Project(1, this.Pr_name, this.Pr_content, this.Pr_description, this.Pr_Place, this.Pr_date, this.Pr_gender)
      await new Promise<void>((resolve, reject) => {

        this.api.AddProject(addProject).subscribe(
          (response) => {
            this.snackBar.open('הפרויקט נוסף בהצלחה', 'x', { duration: 3000 });

            resolve(); // מסמן שהפעולה הושלמה

          },
          (error) => {
            this.snackBar.open('אירעה שגיאה', 'x', { duration: 3000 });

            resolve(); // מסמן שהפעולה הושלמה

          });
      });
      this.empty()
      this.popupDisplayOut.emit(false);
    }
    else {
      this.snackBar.open('!הפרטים שגויים', 'x', { duration: 5000 });
    }
  }
  //עדכון

  public async update(): Promise<void> {
    if (this.validation2()) {

      this.Pr_gender = this.projectUpdate.Pr_gender


      if (this.Pr_name.length == 0) {
        this.Pr_name = this.projectUpdate.Pr_name
      }
      if (this.Pr_content.length == 0) {
        this.Pr_content = this.projectUpdate.Pr_content
      }
      if (this.Pr_description.length == 0) {
        this.Pr_description = this.projectUpdate.Pr_description
      }
      if (this.Pr_Place.length == 0) {
        this.Pr_Place = this.projectUpdate.Pr_Place
      }
      if (this.Pr_date.length == 0) {
        this.Pr_date = this.projectUpdate.Pr_date
      }
      const updateProject: Project = new Project(this.projectUpdate.Pr_code, this.Pr_name, this.Pr_content, this.Pr_description, this.Pr_Place, this.Pr_date, this.Pr_gender)

      await new Promise<void>((resolve, reject) => {

        this.api.UpdateProject(updateProject).subscribe(
          (response) => {
            this.snackBar.open('!הפרויקט עודכן בהצלחה', 'x', { duration: 3000 });

            resolve(); // מסמן שהפעולה הושלמה

          },
          (error) => {
            this.snackBar.open('!אירעה שגיאה', 'x', { duration: 3000 });

            resolve(); // מסמן שהפעולה הושלמה

          });

      });
      this.empty()
      this.popupDisplayOut.emit(false);
    }
    else {
      this.snackBar.open('!הפרטים שגויים', 'x', { duration: 5000 });
    }


  }
  public empty() {

    this.Pr_name = ""
    this.Pr_content = ""
    this.Pr_description = ""
    this.Pr_Place = ""
    this.Pr_date = ""
    this.Pr_gender = 1
    this.cb1 = true;
    this.cb2 = false;
  }
  //ממירה לתאריך
  date(dateString: string) {
    return new Date(dateString);
  }
}
