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
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { Parentt } from '../../models/parent.class';
import { LoadingSpinnerComponent } from "../loading-spinner/loading-spinner.component";
import { AddUpdateStudentComponent } from "../add-update-student/add-update-student.component";
import { DifficultyStudent } from '../../models/difficultyStudent.class';
import { StudiesForStudent } from '../../models/studiesForStudent.class';
import { Worker } from '../../models/worker.class';

@Component({
  selector: 'app-students-for-project',
  standalone: true,
  imports: [CommonModule, UploadFileExcelComponent, AddStudentForProjectComponent, AddGuideForProjectComponent, LoadingSpinnerComponent, AddUpdateStudentComponent],
  templateUrl: './students-for-project.component.html',
  styleUrl: './students-for-project.component.scss'
})
export class StudentsForProjectComponent {
  @Output() popupDisplayOut: EventEmitter<boolean> = new EventEmitter()
  @Input() project: Project = new Project(1, "", "", "", "", "", 1)
  //העברת משתתף לחניך
  studentNew: Student = new Student(111, "4444444444", 1, "", "", "", "", 1, 1, 1, "", "", "", "", -1, 1, 1, "", "", "", 1, "", 1, 1, 1, "")
  ParentNew: Parentt = new Parentt(-1, "", "", "", "")
  Parent1New: Parentt = new Parentt(-1, "", "", "", "")
  DifficultyStudentNew: Array<DifficultyStudent> = []
  WorkerNew: Worker = new Worker(-1, "", 1, 1, "", "", "", "", "")
  StudiesForStudentNew: StudiesForStudent = new StudiesForStudent(111, 1, "", "", "", "", "", "")
  sAddStudentFromSharer = false
  //עדכון פרטי חניך בפרויקט
  studentUpdate: Student = new Student(-1, "4444444444", 1, "", "", "", "", 1, 1, 1, "", "", "", "", -1, 1, 1, "", "", "", 1, "", 1, 1, 1, "")

  studentForProjectUpdate: StudentForProject = new StudentForProject(-1, 1, 1, 1, "", "", this.studentUpdate)


  loading = false
  listAll: Array<GuideWithRelations> = []
  listStudentsForProject: Array<StudentForProject> = []

  sUploadExcel = false
  sAddStudentForProject = false
  sAddGuide = false
  sUpdateStudentForProject = false
  constructor(private api: ApiService, private cdRef: ChangeDetectorRef, private snackBar: MatSnackBar, public dialog: MatDialog) { }
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
  //רישום חניך ממשתתתף
  async editSharerForStudent(sharerForProject: SharerForProject) {
    this.loading = true
    this.studentNew.St_ID = sharerForProject.Sharer.Sh_ID
    this.studentNew.St_gender = sharerForProject.Sharer.Sh_gender
    this.studentNew.St_name = sharerForProject.Sharer.Sh_name
    this.studentNew.St_Fname = sharerForProject.Sharer.Sh_Fname
    this.studentNew.St_birthday = sharerForProject.Sharer.Sh_birthday
    this.studentNew.St_father_code = sharerForProject.Sharer.Sh_father_code
    this.studentNew.St_mother_code = sharerForProject.Sharer.Sh_mother_code
    this.studentNew.St_city_code = sharerForProject.Sharer.Sh_city_code
    this.studentNew.St_address = sharerForProject.Sharer.Sh_address
    this.studentNew.St_cell_phone = sharerForProject.Sharer.Sh_cell_phone
    this.studentNew.St_phone = sharerForProject.Sharer.Sh_phone
    this.studentNew.St_nusah_tfila = sharerForProject.Sharer.Sh_nusah_tfila
    this.studentNew.St_worker_code = -1;
    this.studentNew.St_code_synagogue = -1
    this.studentNew.St_activity_status = 1
    this.studentNew.St_email = ""
    this.studentNew.St_risk_code = 1
    this.studentNew.St_description_reception_status = ""
    this.studentNew.St_contact = ""
    this.studentNew.St_contact_phone = ""
    this.studentNew.St_socioeconomic_status = 10
    this.studentNew.St_requester = ""
    this.studentNew.St_code_frequency = 1
    this.studentNew.St_amount_frequency = 1
    //שליפת הורים
    await new Promise<void>((resolve, reject) => {

      const code = this.studentNew?.St_father_code;
      if (code != null) {
        this.api.GetParentOfCode(code).subscribe(data => {
          this.ParentNew = data;
          resolve();

        });
      }
    })
    await new Promise<void>((resolve, reject) => {
      const code1 = this.studentNew?.St_mother_code;
      if (code1 != null) {
        this.api.GetParentOfCode(code1).subscribe(data => {
          this.Parent1New = data;
          resolve();

        });
      }
    })
    const dataStudentAdd = { data: [this.studentNew, this.ParentNew, this.Parent1New, this.DifficultyStudentNew, this.StudiesForStudentNew] }

    //הוספת חניך
    await new Promise<void>((resolve, reject) => {

      this.api.AddStudent(dataStudentAdd).subscribe(
        (response) => {
          this.studentNew.St_code = (response as Student).St_code
          this.studentNew.St_worker_code = (response as Student).St_worker_code
          this.studentNew.St_code_synagogue = (response as Student).St_code_synagogue
          resolve();
        },
        (error) => {
          resolve();
        });
    });


    //שליפת לימודים
    await new Promise<void>((resolve, reject) => {
      const code = this.studentNew.St_code;
      if (code != null) {
        this.api.GetStudiesOfCodeStudent(code).subscribe(data => {
          this.StudiesForStudentNew = data;
          resolve();

        });
      }
    })
    //שליפת רשימת קשיים
    await new Promise<void>((resolve, reject) => {
      const code = this.studentNew.St_code;
      if (code != null) {
        this.api.GetDifficultyesOfCodeStudent(code).subscribe(data => {
          this.DifficultyStudentNew = []
          this.DifficultyStudentNew.push(...data);

          resolve();

        });
      }
    })
    //שליפת פעיל
    await new Promise<void>((resolve, reject) => {
      const code = this.studentNew.St_worker_code;
      if (code != null) {
        this.api.GetWorkerOfCodeStudent(code).subscribe(data => {
          this.WorkerNew = data;
          resolve();

        });
      }
    })
    //רישום לפרויקט כחניך
    const studentForProject: StudentForProject = new StudentForProject(1, this.project.Pr_code, this.studentNew.St_code, sharerForProject.SFP_code_guide, sharerForProject.SFP_name_school_bein_hazmanim, sharerForProject.SFP_veshinantem,this.studentNew)
    await new Promise<void>((resolve, reject) => {
      this.api.AddStudentForProject(studentForProject).subscribe(
        (response) => {
          resolve(); // מסמן שהפעולה הושלמה

        },
        (error) => {
          resolve(); // מסמן שהפעולה הושלמה

        });
    });
    //מחיקה מהפרויקט כמשתתף
    this.api.deleteSharerForProjects(sharerForProject.SFP_code).subscribe(
      (message: any) => {
        this.general();
      },
      (error) => {
      });
    this.loading = false

    this.sAddStudentFromSharer = true

  }
  //מחיקת  משתתף מפרויקט
  deleteSharer(codeSharerForProject: number, nameSharer: string) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '350px',
      data: { title: 'אישור מחיקה', message: ' :האם למחוק את המשתתף' + nameSharer + '\n מפרויקט:' + this.project.Pr_name + '?' }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // קוד לביצוע מחיקה
        this.api.deleteSharerForProjects(codeSharerForProject).subscribe(
          (message: any) => {
            this.snackBar.open(message.message, 'x', { duration: 3000 });
            this.general();
          },
          (error) => {
            this.snackBar.open(error.error.error, 'x', { duration: 3000 });
          });

      }
    });
  }
  displayStudent(student: Student) {

  }

  editStudent(studentForProject: StudentForProject) {

    this.studentForProjectUpdate = studentForProject
    this.sUpdateStudentForProject = true
  }
  //מחיקת חניך מפרויקט
  deleteStudent(codeStudentForProject: number, nameStudent: string) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '350px',
      data: { title: 'אישור מחיקה', message: ' :האם למחוק את החניך' + nameStudent + '\n מפרויקט:' + this.project.Pr_name + '?' }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // קוד לביצוע מחיקה
        this.api.deleteStudentForProject(codeStudentForProject).subscribe(
          (message: any) => {
            this.snackBar.open(message.message, 'x', { duration: 3000 });
            this.general();
          },
          (error: any) => {
            this.snackBar.open(error.error.error, 'x', { duration: 3000 });
          });

      }
    });
  }
  print() {
    window.print();
  }
  enterListOfStudents() {
    this.listStudentsForProject = []
    this.listAll.forEach(g => {
      this.listStudentsForProject.push(...g.students)
    });
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
    this.sUpdateStudentForProject = display
    this.general();
  }
  //סגירת פופפ הוספת מדריך
  closeAddGuide(display: boolean) {
    this.sAddGuide = display;
    this.general();
  }
  //סגירת פופפ  העברת משתתף לרישום כחניך
  closePAddStudentFromSharer(display: boolean) {
    this.sAddStudentFromSharer = display;
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
