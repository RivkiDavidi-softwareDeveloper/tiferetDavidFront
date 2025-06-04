import { Component, EventEmitter, Input, Output, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Project } from '../../models/project.class';
import { StudentsForProjectComponent } from "../students-for-project/students-for-project.component";
import { NewProjectComponent } from "../new-project/new-project.component";
import { ApiService } from '../../services/api.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';
@Component({
  selector: 'app-project',
  standalone: true,
  templateUrl: './project.component.html',
  styleUrl: './project.component.scss',
  imports: [CommonModule, StudentsForProjectComponent, NewProjectComponent]
})
export class ProjectComponent {
  @Input() project: Project = new Project(1, "", "", "", "", "", 1);
  @Output() dataSent = new EventEmitter<boolean>();
  constructor(private api: ApiService, private snackBar: MatSnackBar, public dialog: MatDialog) { }

  displayPopap = false;
  displayAddProject = false

  //סגירת הפופפ
  closeP(display: boolean) {
    this.displayPopap = display;
  }

  //סגירת הפופפ
  closeP2(display: boolean) {
    this.displayAddProject = display;
    this.dataSent.emit(true);

  }
  async deleteProject() {
    await new Promise<void>((resolve, reject) => {

      const dialogRef = this.dialog.open(ConfirmDialogComponent, {
        width: '350px',
        data: { title: 'אישור מחיקה', message: ' \n האם אתה בטוח שברצונך למחוק את הפרויקט ' + this.project.Pr_name + '?' }
      });
      dialogRef.afterClosed().subscribe(result => {
        if (result) {


          this.api.deleteProject(this.project.Pr_code).subscribe(
            (response) => {
              this.snackBar.open('!הפרויקט נמחק בהצלחה', 'x', { duration: 3000 });
                                this.dataSent.emit(true);

              resolve();

            },
            (error) => {
              this.snackBar.open('!אירעה שגיאה', 'x', { duration: 3000 });
              resolve(); 
            });
        }
        else{
                        resolve(); 

        }
      });

    });
  }

}
