import { ChangeDetectorRef, Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StudentForProject } from '../../models/studentForProject.class';
import { ApiService } from '../../services/api.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Project } from '../../models/project.class';
import { Student } from '../../models/student.class';
import { SharerForProject } from '../../models/sharerForProject.class';
import { UploadFileExcelComponent } from "../upload-file-excel/upload-file-excel.component";
import { GuideForProject } from '../../models/guideForProject.class';
import { GuideWithRelations } from '../../models/guideWithRelations.interface';
import { AddStudentForProjectComponent } from "../add-student-for-project/add-student-for-project.component";
import { AddGuideForProjectComponent } from "../add-guide-for-project/add-guide-for-project.component";
import { Sharer } from '../../models/sharer.class';

@Component({
  selector: 'app-students-for-project',
  standalone: true,
  imports: [CommonModule, UploadFileExcelComponent, AddStudentForProjectComponent, AddGuideForProjectComponent],
  templateUrl: './students-for-project.component.html',
  styleUrl: './students-for-project.component.scss'
})
export class StudentsForProjectComponent {
  @Output() popupDisplayOut: EventEmitter<boolean> = new EventEmitter()
  @Input() project: Project = new Project(1, "", "", "", "", "", 1)



  listAll: Array<GuideWithRelations> = []
  sUploadExcel = false
  sAddStudentForProject = false
  sAddGuide = false
  constructor(private api: ApiService, private cdRef: ChangeDetectorRef, private snackBar: MatSnackBar) { }
  ngOnInit() {
    this.general();
  }
  //חניכים לפרויקט
  general() {

    this.api.getGuidesForProjectsWithSudentsAndSharers(this.project.Pr_code).subscribe(Date => {
      this.listAll = []
      this.listAll.push(...Date);
      this.cdRef.detectChanges();
    })
  }
  displaySharer(sharer: Sharer) {

  }
  editSharer(sharer: Sharer) {

  }
  deleteSharer(codeSharer: number, nameSharer: string) {

  }
  displayStudent(student: Student) {

  }
  
  editStudent(student: Student) {

  }
  deleteStudent(codeStudent: number, nameStudent: string) {

  }
print(){
    window.print();
}
  //סגירת הפופפ
  close(): void {
    this.popupDisplayOut.emit(false)
  }
  //סגירת פופפ אקסל
  closePUploadExcel(display: boolean) {
    this.sUploadExcel = display;
    this.general();
  }
  //סגירת פופפ הוספת חניכים ממאגר
  closePAddStudentForProject(display: boolean) {
    this.sAddStudentForProject = display;
    this.general();
  }
  //סגירת פופפ הוספת מדריך
  closeAddGuide(display: boolean) {
    this.sAddGuide = display;
    this.general();
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
