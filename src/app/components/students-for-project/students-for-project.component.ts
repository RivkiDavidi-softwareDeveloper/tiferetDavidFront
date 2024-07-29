import { ChangeDetectorRef, Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StudentForProject } from '../../models/studentForProject.class';
import { ApiService } from '../../services/api.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Project } from '../../models/project.class';
import { Student } from '../../models/student.class';

@Component({
  selector: 'app-students-for-project',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './students-for-project.component.html',
  styleUrl: './students-for-project.component.scss'
})
export class StudentsForProjectComponent {
  @Output() popupDisplayOut: EventEmitter<boolean> = new EventEmitter()
  @Input() project: Project = new Project(1, "", "", "", "", "", 1)
  listStudentsForProjects: Array<StudentForProject> = []
  listOfStudents:Array<Student>=[]
  constructor(private api: ApiService, private cdRef: ChangeDetectorRef, private snackBar: MatSnackBar) { }
  ngOnInit() {
    this.general();
    this.generalStudents();
  }
  //חניכים לפרויקט
  general() {
    this.api.getStudentsForProjects(this.project.Pr_code).subscribe(Date => {
      this.listStudentsForProjects = []
      this.listStudentsForProjects.push(...Date);
      this.cdRef.detectChanges();
    })

  }
  //רשימת חניכים
  generalStudents(): void {
    this.api.getStudents(0, 0, 0, -1).subscribe(Date => {
      this.listOfStudents = []
      this.listOfStudents.push(...Date);
      this.cdRef.detectChanges();
    })
  }
//שם חניך
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
}
  //סגירת הפופפ
  close(): void {
    this.popupDisplayOut.emit(false)
  }
}
