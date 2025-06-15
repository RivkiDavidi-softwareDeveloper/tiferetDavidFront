import { ChangeDetectorRef, Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Student } from '../../models/student.class';
import { ApiService } from '../../services/api.service';

import { Worker } from '../../models/worker.class';
import { TypeGender } from '../../models/TypeGender.enum';
import { MatSnackBar } from '@angular/material/snack-bar';
import { interval } from 'rxjs';
import { fail } from 'node:assert';
import { AddUpdateStudentComponent } from "../add-update-student/add-update-student.component";
import { Parentt } from '../../models/parent.class';
import { DisplayStudentComponent } from "../display-student/display-student.component";
import { TypeActivityState } from '../../models/typeActivityState.enum';
import { StudiesForStudent } from '../../models/studiesForStudent.class';
import { DifficultyStudent } from '../../models/difficultyStudent.class';
import { UploadFileExcelComponent } from "../upload-file-excel/upload-file-excel.component";
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';
import { response } from 'express';
import { error } from 'node:console';
import { Project } from '../../models/project.class';
import { LoadingSpinnerComponent } from '../loading-spinner/loading-spinner.component';
import { GuideForProject } from '../../models/guideForProject.class';
import { StudentForProject } from '../../models/studentForProject.class';
import { GuideWithRelations } from '../../models/guideWithRelations.interface';
@Component({
  selector: 'app-add-student-for-project',
  standalone: true,
  imports: [CommonModule, LoadingSpinnerComponent],
  templateUrl: './add-student-for-project.component.html',
  styleUrl: './add-student-for-project.component.scss'
})
export class AddStudentForProjectComponent {
  @Output() popupDisplayOut: EventEmitter<boolean> = new EventEmitter()
  @Input() popupDisplayIn: boolean = false;
  @Input() status = "add"
  @Input() listStudentsForProject: Array<StudentForProject> = []
  SFP_name_school_bein_hazmanim = ""
  St_nusah_tfila = ""
  SFP_veshinantem = ""
  validNaneBeinHazmanim = false
  validNusahTfila = false
  validVeshinantem = false

  //לעדכון
  studentUpdate: Student = new Student(-1, "4444444444", 1, "", "", "", "", 1, 1, 1, "", "", "", "", -1, 1, 1, "", "", "", 1, "", 1, 1, 1, "")

  @Input() studentForProjectUpdate: StudentForProject = new StudentForProject(-1, 1, 1, 1, "", "", this.studentUpdate)

  @Input() project: Project = new Project(-1, "", "", "", "", "", 1)
  selectedGuideCode: number = -1
  selectedStudent: Student = new Student(-1, "4444444444", 1, "", "", "", "", 1, 1, 1, "", "", "", "", -1, 1, 1, "", "", "", 1, "", 1, 1, 1, "")

  listOfStudents: Array<Student> = []
  @Input() listOfGuides: Array<GuideWithRelations> = []
  //הגדרות סינונים של חניכים
  //מגדר-1 אב-0
  order = 1;
  genderF = 0;
  searchText = ""
  //אנימציה
  loading = false
  constructor(private api: ApiService, private cdRef: ChangeDetectorRef, private snackBar: MatSnackBar) { }
  ngOnInit() {
    this.generalStudent();
    /*     this.generalGuides();
     */
  }
  //חניכים 
  generalStudent() {

    this.api.FindStudent(this.searchText, this.order, this.project.Pr_gender, 0, -1).subscribe(Date => {
      this.listOfStudents = []
      this.listOfStudents.push(...Date);
      this.cdRef.detectChanges();
    })
  }

  //מדריכים 
  /*   generalGuides() {
  
      this.api.getGuidesForProjects(this.project.Pr_code).subscribe(Date => {
        this.listOfGuides = []
        this.listOfGuides.push(...Date);
        this.cdRef.detectChanges();
      })
    } */
  //בחירת מדריך
  onGuideSelected(event: Event) {
    this.selectedGuideCode = Number((event.target as HTMLInputElement).value);
  }
  //הוספה
  async add() {
    if (this.selectedGuideCode != -1 && this.selectedStudent.St_code != -1 && this.project.Pr_code != -1 && !this.validNaneBeinHazmanim && !this.validNusahTfila && !this.validVeshinantem) {
      this.loading = true
      console.log(this.selectedStudent.St_code + "קוד חניך")
      const studentExists = this.listStudentsForProject.find(s => s.SFP_code_student == this.selectedStudent.St_code)
      console.log(this.listStudentsForProject.length)
      if (studentExists != null) {
        this.snackBar.open('החניך כבר רשום לפרויקט', 'x', { duration: 3000 });
        this.loading = false

        return;

      }
      const studentForProject: StudentForProject = new StudentForProject(1, this.project.Pr_code, this.selectedStudent.St_code, this.selectedGuideCode, this.SFP_name_school_bein_hazmanim, this.SFP_veshinantem, this.selectedStudent)
      await new Promise<void>((resolve, reject) => {

        this.api.AddStudentForProject(studentForProject).subscribe(
          (response) => {
            resolve(); // מסמן שהפעולה הושלמה

          },
          (error) => {
            resolve(); // מסמן שהפעולה הושלמה

          });
      });
      this.selectedStudent.St_nusah_tfila = this.St_nusah_tfila;
      await new Promise<void>((resolve, reject) => {

        this.api.UpdateStudentForStudentForProjectOnly(this.selectedStudent).subscribe(
          (response) => {
            resolve(); // מסמן שהפעולה הושלמה

          },
          (error) => {
            resolve(); // מסמן שהפעולה הושלמה

          });
      });
      this.loading = false

      this.empty()
      this.popupDisplayOut.emit(false);
    }
    else {
      this.snackBar.open('לא נבחר חניך או מדריך', 'x', { duration: 3000 });

    }
  }
  //עדכון
  async update() {
    if (!this.validNaneBeinHazmanim && !this.validNusahTfila && !this.validVeshinantem) {
      this.loading = true
      //נוסח תפילה
      if (this.St_nusah_tfila.length == 0) {
        this.St_nusah_tfila = this.studentForProjectUpdate.Student.St_nusah_tfila
      }
      this.studentForProjectUpdate.Student.St_nusah_tfila = this.St_nusah_tfila;
      //עדכון חניך
      await new Promise<void>((resolve, reject) => {

        this.api.UpdateStudentForStudentForProjectOnly(this.studentForProjectUpdate.Student).subscribe(
          (response) => {
            resolve(); // מסמן שהפעולה הושלמה

          },
          (error) => {
            resolve(); // מסמן שהפעולה הושלמה

          });
      });
      //ושננתם
      if (this.SFP_veshinantem.length == 0) {
        this.SFP_veshinantem = this.studentForProjectUpdate.SFP_veshinantem
      }
      //בין הזמנים
      if (this.SFP_name_school_bein_hazmanim.length == 0) {
        this.SFP_name_school_bein_hazmanim = this.studentForProjectUpdate.SFP_name_school_bein_hazmanim
      }
      //מדריך
      if (this.selectedGuideCode != -1) {
        this.studentForProjectUpdate.SFP_code_guide = this.selectedGuideCode
      }
      //עדכון חניך לפרויקט

      const studentForProjectUpdate: StudentForProject = new StudentForProject(this.studentForProjectUpdate.SFP_code, this.studentForProjectUpdate.SFP_code_project
        , this.studentForProjectUpdate.SFP_code_student, this.studentForProjectUpdate.SFP_code_guide, this.SFP_name_school_bein_hazmanim, this.SFP_veshinantem, this.studentForProjectUpdate.Student);
      await new Promise<void>((resolve, reject) => {
        this.api.UpdateStudentForProject(studentForProjectUpdate).subscribe(
          (response) => {
            resolve();
          },
          (error) => {
            resolve();
          }
        );
      });
      this.loading = false
      this.empty()
      this.popupDisplayOut.emit(false);
    }
    else {
      this.snackBar.open('פרטים שגויים', 'x', { duration: 3000 });

    }

  }
  empty() {
    this.selectedGuideCode = -1
    this.selectedStudent = new Student(-1, "4444444444", 1, "", "", "", "", 1, 1, 1, "", "", "", "", -1, 1, 1, "", "", "", 1, "", 1, 1, 1, "")
    this.searchText = ""
    this.SFP_name_school_bein_hazmanim = ""
    this.St_nusah_tfila = ""
    this.SFP_veshinantem = ""
    this.validNaneBeinHazmanim = false
    this.validNusahTfila = false
    this.validVeshinantem = false
    this.generalStudent()
  }
  //חיפוש
  onInputChange(event: Event) {
    this.searchText = (event.target as HTMLInputElement).value;
    this.generalStudent()
  }
  //סגירת הפופפ
  close(): void {
    this.empty()
    this.popupDisplayOut.emit(false)
  }
  //בחירת חניך
  Select(student: Student) {
    if (this.selectedStudent.St_code == student.St_code) {
      this.selectedStudent = new Student(-1, "4444444444", 1, "", "", "", "", 1, 1, 1, "", "", "", "", -1, 1, 1, "", "", "", 1, "", 1, 1, 1, "")
    }
    else
      this.selectedStudent = student;
  }
  //ישיבת בין הזמנים
  onInputChangeNaneBeinHazmanim(event: Event) {
    const name: string = (event.target as HTMLInputElement).value
    if (name.length <= 40) {
      this.SFP_name_school_bein_hazmanim = name;
      this.validNaneBeinHazmanim = false;
    }
    else {
      this.validNaneBeinHazmanim = true;
    }
  }
  //נוסח תפילה
  onInputChangeNusahTfila(event: Event) {
    const name: string = (event.target as HTMLInputElement).value
    if (name.length <= 40) {
      this.St_nusah_tfila = name;
      this.validNusahTfila = false;
    }
    else {
      this.validNusahTfila = true;
    }
  }
  //ושננתם
  onInputChangeVeshinantem(event: Event) {
    const name: string = (event.target as HTMLInputElement).value
    if (name.length <= 40) {
      this.SFP_veshinantem = name;
      this.validVeshinantem = false;
    }
    else {
      this.validVeshinantem = true;
    }
  }
}


