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
  selector: 'app-add-guide-for-project',
  standalone: true,
  imports: [CommonModule, LoadingSpinnerComponent],
  templateUrl: './add-guide-for-project.component.html',
  styleUrl: './add-guide-for-project.component.scss'
})
export class AddGuideForProjectComponent {
  @Output() popupDisplayOut: EventEmitter<boolean> = new EventEmitter()
  @Input() popupDisplayIn: boolean = false;
  @Input() codeProject = -1;
  nameGuide = "";
  idGuide = ""
  @Input() status = "add"
  validNane = false
  validID = false

  //עדכון
  @Input() guideForProjectUpdate: GuideForProject = new GuideForProject(-1, 1, "", "")
  //אנימציה
  loading = false
  constructor(private api: ApiService, private cdRef: ChangeDetectorRef, private snackBar: MatSnackBar) { }

  //סגירת הפופפ
  close(): void {
    this.popupDisplayOut.emit(false)
  }
  //שם
  onInputChangeN(event: Event) {
    const name: string = (event.target as HTMLInputElement).value
    if (name.length <= 30) {
      this.nameGuide = name;
      this.validNane = false;
    }
    else {
      this.validNane = true;
    }
  }
    //ת.ז
  onInputChangeID(event: Event) {
    const id: string = (event.target as HTMLInputElement).value
    if (id.length ==9) {
      this.idGuide = id;
      this.validID = false;
    }
    else {
      this.validID = true;
    }
  }
  async add() {
    if (this.nameGuide == "" || this.idGuide == "" || this.codeProject == -1 || this.validNane == true || this.validID == true) {
      this.snackBar.open('אחד הפרטים חסרים או שגויים', 'x', { duration: 3000 });

    } else {
      this.loading = true
      const guideForProject: GuideForProject = new GuideForProject(1, this.codeProject, this.nameGuide, this.idGuide)
      await new Promise<void>((resolve, reject) => {

        this.api.AddGuideForProject(guideForProject).subscribe(
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
  async update() {
    if (this.validNane == true || this.validID == true) {
      this.snackBar.open('אחד הפרטים חסרים או שגויים', 'x', { duration: 3000 });

    } else {
      this.loading = true

      if (this.nameGuide.length == 0) {
        this.nameGuide = this.guideForProjectUpdate.GFP_name
      }
      if (this.idGuide.length == 0) {
        this.idGuide = this.guideForProjectUpdate.GFP_name
      }
      this.guideForProjectUpdate.GFP_ID = this.idGuide
      //עדכון מדריך לפרויקט
      await new Promise<void>((resolve, reject) => {
        this.api.UpdateGuideForProject(this.guideForProjectUpdate).subscribe(
          (response) => {
            resolve();

          },
          (error) => {
            resolve();

          });
      });
      this.loading = false

      this.empty()
      this.popupDisplayOut.emit(false);
    }
  }
  empty() {
    this.nameGuide = ""
    this.idGuide = ""
    this.validID = false
    this.validNane = false

  }
}
