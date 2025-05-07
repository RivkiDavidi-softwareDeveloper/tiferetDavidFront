import { ChangeDetectorRef, Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Project } from '../../models/project.class';
import { ApiService } from '../../services/api.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Worker } from '../../models/worker.class';

@Component({
  selector: 'app-contact-to-project',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './contact-to-project.component.html',
  styleUrl: './contact-to-project.component.scss'
})
export class ContactToProjectComponent {
  @Input() worker: Worker | undefined
  listProject: Array<Project> = []
  codeProject = 0;
  constructor(private api: ApiService, private cdRef: ChangeDetectorRef, private snackBar: MatSnackBar) { }
  ngOnInit() {
    this.general();
  }
  async general() {
    if (this.worker)
      this.api.getProgects(this.worker.Wo_gender,"").subscribe(Date => {
        this.listProject = []
        this.listProject.push(...Date);
        this.cdRef.detectChanges();
      })

  }
  selectProject(event: Event) {
    this.codeProject = Number((event.target as HTMLInputElement).value);
  }
  addAllStudentForProject() {
    if (this.codeProject == 0) {
      this.snackBar.open('לא נבחר פרויקט', 'סגור', { duration: 2000 });
    }

    this.api.AddStudentsForProjectForWorker(this.worker?.Wo_code, this.codeProject).subscribe(

      (response) => {
        this.snackBar.open('החניכים שויכו בהצלחה', 'סגור', { duration: 2000 });

      },
      (error) => {
        this.snackBar.open('השיוך נכשל', 'סגור', { duration: 2000 });

      });

  }
}
