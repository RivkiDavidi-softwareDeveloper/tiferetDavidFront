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

  @Input() project: Project = new Project(-1, "", "", "", "", "", 1)
  selectedGuideCode: number = -1
  selectedStudent: Student = new Student(-1, "4444444444", 1, "", "", "", "", 1, 1, 1, "", "", "", "", -1, 1, 1, "", "", "", 1, "", 1, 1, 1)

  listOfStudents: Array<Student> = []
  listOfGuides: Array<GuideForProject> = []
  sUploadExcel = false
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
    this.generalGuides();

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
  generalGuides() {

    this.api.getGuidesForProjects(this.project.Pr_code).subscribe(Date => {
      this.listOfGuides = []
      this.listOfGuides.push(...Date);
      this.cdRef.detectChanges();
    })
  }
  onGuideSelected(event: Event) {
    this.selectedGuideCode = Number((event.target as HTMLInputElement).value);
  }
  async add() {
    if (this.selectedGuideCode != -1 && this.selectedStudent.St_code != -1 && this.project.Pr_code != -1) {
      this.loading = true
      const studentForProject: StudentForProject = new StudentForProject(1, this.project.Pr_code, this.selectedStudent.St_code, this.selectedGuideCode, this.selectedStudent)
      await new Promise<void>((resolve, reject) => {

        this.api.AddStudentForProject(studentForProject).subscribe(
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
  }
  empty() {
    this.selectedGuideCode = -1
    this.selectedStudent = new Student(-1, "4444444444", 1, "", "", "", "", 1, 1, 1, "", "", "", "", -1, 1, 1, "", "", "", 1, "", 1, 1, 1)

  }
    //חיפוש
  onInputChange(event: Event) {
    this.searchText = (event.target as HTMLInputElement).value;
    this.generalStudent()
  }
  //סגירת הפופפ
  close(): void {
    this.popupDisplayOut.emit(false)
  }
  Select(student: Student) {
    this.selectedStudent = student;
  }
}


