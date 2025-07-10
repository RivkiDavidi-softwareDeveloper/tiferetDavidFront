import { ChangeDetectorRef, Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Project } from '../../models/project.class';
import { ApiService } from '../../services/api.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Worker } from '../../models/worker.class';
import { AddStudentForProjectComponent } from "../add-student-for-project/add-student-for-project.component";
import { GuideWithRelations } from '../../models/guideWithRelations.interface';
import { StudentForProject } from '../../models/studentForProject.class';

@Component({
  selector: 'app-contact-to-project',
  standalone: true,
  imports: [CommonModule, AddStudentForProjectComponent],
  templateUrl: './contact-to-project.component.html',
  styleUrl: './contact-to-project.component.scss'
})
export class ContactToProjectComponent {
  @Input() worker: Worker = new Worker(-1, "", 1, 1, "", "", "", "", "",1)
  listProject: Array<Project> = []
  codeProject = -1;
  //שיוך חניך נבחר
  sAddStudentForProject = false;
  projectSelected: Project = new Project(-1, "", "", "", "", "", 1)
  listAll: Array<GuideWithRelations> = []
  listStudentsForProject: Array<StudentForProject> = []

  constructor(private api: ApiService, private cdRef: ChangeDetectorRef, private snackBar: MatSnackBar) { }
  ngOnInit() {
    this.general();
  }
  async general() {
    await new Promise<void>((resolve, reject) => {
      if (this.worker.Wo_code != -1)
        this.api.getProgects(this.worker.Wo_gender, "").subscribe(Date => {
          this.listProject = []
          this.listProject.push(...Date);
          this.cdRef.detectChanges();
          resolve();
        })
      else {
        resolve();

      }
    });

  }
  selectProject(event: Event) {
    this.codeProject = Number((event.target as HTMLInputElement).value);
    const project = this.listProject.find(p => p.Pr_code === this.codeProject);
    if (project) {
      this.projectSelected=project
    }
  }
  //הוספת כל החניכים לפרויקט
  async addAllStudentForProject() {
    if (this.codeProject == -1) {
      this.snackBar.open('לא נבחר פרויקט', 'סגור', { duration: 3000 });
    }
    else {
      await new Promise<void>((resolve, reject) => {
        if (this.worker.Wo_code != -1)
          this.api.AddStudentsForProjectForWorker(this.worker.Wo_code, this.codeProject).subscribe(

            (response) => {
              this.snackBar.open('החניכים שויכו בהצלחה', 'סגור', { duration: 3000 });
              resolve()
            },
            (error) => {
              this.snackBar.open('השיוך נכשל', 'סגור', { duration: 3000 });
              resolve()
            });
        else {
          this.snackBar.open('השיוך נכשל', 'סגור', { duration: 3000 });
          resolve()

        }

      });
    }


  }
  //פתיחת פופפ חניך מסוים
  async selectStudentForProject() {
    if (this.codeProject == -1) {
      this.snackBar.open('לא נבחר פרויקט', 'סגור', { duration: 3000 });
    }
    else {
      await new Promise<void>((resolve, reject) => {

        if (this.worker.Wo_code != -1) {
          this.api.getGuidesForProjectsWithSudentsAndSharers(this.projectSelected.Pr_code).subscribe(Date => {
            this.listAll = []
            this.listAll.push(...Date);
            this.cdRef.detectChanges();
            this.listStudentsForProject = []
            this.listAll.forEach(g => {
              this.listStudentsForProject.push(...g.students)
            });
            resolve()
          })
        }
        else {
          resolve()
        }
      });
      this.sAddStudentForProject = true
    }



  }
  //סגירת פופפ הוספת חניך ממאגר
  closePAddStudentForProject(display: boolean) {
    this.sAddStudentForProject = display;
  }

}
