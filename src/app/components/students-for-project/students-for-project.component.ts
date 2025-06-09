import { ChangeDetectorRef, Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StudentForProject } from '../../models/studentForProject.class';
import { ApiService } from '../../services/api.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Project } from '../../models/project.class';
import { Student } from '../../models/student.class';
import { SharerForProject } from '../../models/sharerForProject.class';
import { UploadFileExcelComponent } from "../upload-file-excel/upload-file-excel.component";
import { GuideForProject } from '../../models/guideForProject';

@Component({
  selector: 'app-students-for-project',
  standalone: true,
  imports: [CommonModule, UploadFileExcelComponent],
  templateUrl: './students-for-project.component.html',
  styleUrl: './students-for-project.component.scss'
})
export class StudentsForProjectComponent {
  @Output() popupDisplayOut: EventEmitter<boolean> = new EventEmitter()
  @Input() project: Project = new Project(1, "", "", "", "", "", 1)
  listStudentsForProjects: Array<StudentForProject> = []
  listSharersForProjects: Array<SharerForProject> = []
  listGuideForProjects: Array<GuideForProject> = []

  sUploadExcel = false

  constructor(private api: ApiService, private cdRef: ChangeDetectorRef, private snackBar: MatSnackBar) { }
  ngOnInit() {
    this.general();
  }
  //חניכים לפרויקט
  general() {
    this.api.getStudentsForProjects(this.project.Pr_code).subscribe(Date => {
      this.listStudentsForProjects = []
      this.listStudentsForProjects.push(...Date);
      this.cdRef.detectChanges();
    })
    this.api.getSharersForProjects(this.project.Pr_code).subscribe(Date => {
      this.listSharersForProjects = []
      this.listSharersForProjects.push(...Date);
      this.cdRef.detectChanges();
    })
    this.api.getGuidesForProjects(this.project.Pr_code).subscribe(Date => {
      this.listGuideForProjects = []
      this.listGuideForProjects.push(...Date);
      this.cdRef.detectChanges();
    })
  }

  //סגירת הפופפ
  close(): void {
    this.popupDisplayOut.emit(false)
  }
  //סגירת פופפ אקסל
  closePUploadExcel(display: boolean) {
    this.sUploadExcel = display;
    this.general();
    // this.imageBlobURL = ""
  }
}














/*   //רשימת חניכים
  generalStudents(): void {
    this.api.FindStudent("", 0, 0, 0, -1).subscribe(Date => {
      this.listOfStudents = []
      this.listOfStudents.push(...Date);
      this.cdRef.detectChanges();
    })
  } */
/*   //שם חניך
  nameStudent(codeStudent: number) {
    if (codeStudent == -1) {
      return "---"
    }
    var name = "";
    this.listOfStudents.forEach(s => {
      if (s.St_code == codeStudent) {
        name = s.St_name + " " + s.St_Fname;
      }
    });
    return name;
  } */
