import { ChangeDetectorRef, Component, EventEmitter, Input, Output, OnDestroy, OnInit } from '@angular/core';
import { io, Socket } from 'socket.io-client';
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
import { DisplayStudentComponent } from "../display-student/display-student.component";
import { DisplaySharerComponent } from "../display-sharer/display-sharer.component";
import { StudiesForSharer } from '../../models/studiesForSharer.class';
import { UpdateSharerComponent } from "../update-sharer/update-sharer.component";
import { error } from 'console';

@Component({
  selector: 'app-students-for-project',
  standalone: true,
  imports: [CommonModule, UploadFileExcelComponent, AddStudentForProjectComponent, AddGuideForProjectComponent, LoadingSpinnerComponent, AddUpdateStudentComponent, DisplayStudentComponent, DisplaySharerComponent, UpdateSharerComponent],
  templateUrl: './students-for-project.component.html',
  styleUrl: './students-for-project.component.scss'
})
export class StudentsForProjectComponent implements OnInit, OnDestroy {
  //סינכרון נתונים בין לקוחות
  socket: Socket | undefined;
  ngOnDestroy(): void {
    if (this.socket)
      this.socket.disconnect();
  }
  connectSocket(): void {
    /*  this.socket = io(this.api.urlBasisSocket, {
       transports: ["websocket"]
     });    this.socket.on("guides-updated", () => {
       this.general();
     });
     this.socket.on("sharers-updated", async () => {
       this.general();
 
     });
     this.socket.on("studentsForProjects-updated", async () => {
       this.general();
 
     }); */
  }



amountSharersAndStudents:number=0
  @Output() popupDisplayOut: EventEmitter<boolean> = new EventEmitter()
  @Input() project: Project = new Project(1, "", "", "", "", "", 1)
  //העברת משתתף לחניך
  studentNew: Student = new Student(111, "4444444444", 1, "", "", "", "", 1, 1, 1, "", "", "", "", -1, 1, 1, "", "", "", 1, "", 1, 1, 1, "", "", "")
  ParentNew: Parentt = new Parentt(-1, "", "", "", "")
  Parent1New: Parentt = new Parentt(-1, "", "", "", "")
  DifficultyStudentNew: Array<DifficultyStudent> = []
  WorkerNew: Worker = new Worker(-1, "", 1, 1, "", "", "", "", "",1)
  StudiesForStudentNew: StudiesForStudent = new StudiesForStudent(111, 1, "", "", "", "", "", "")
  sAddStudentFromSharer = false
  studentForProject: StudentForProject = new StudentForProject(1, 1, 1, 1, "", "", this.studentNew)
  sharer: Sharer = new Sharer(-1, "", 1, "", "", "", 1, 1, 1, "", "", "", "")

  //הצגת חניך
  studentDisplay: Student = new Student(111, "", 1, "", "", "", "", 1, 1, 1, "", "", "", "", 1, 1, 1, "", "", "", 1, "", 1, 1, 1, "", "", "")
  ParentDisplay: Parentt = new Parentt(111, "", "", "", "")
  Parent1Display: Parentt = new Parentt(111, "", "", "", "")
  DifficultyStudentDisplay: Array<DifficultyStudent> = []
  WorkerDisplay: Worker = new Worker(111, "", 1, 1, "", "", "", "", "",1)
  StudiesForStudentDisplay: StudiesForStudent = new StudiesForStudent(111, 1, "", "", "", "", "", "")
  displayPopup: boolean = false;
  imageBlobURL: string = ""
  listStudentForProjects: Array<StudentForProject> = []
  listSharerForProjects: Array<SharerForProject> = []
  //ערוך מדריך
  guideForProjectUpdate: GuideForProject = new GuideForProject(-1, 1, "", "")
  sUpdateGuide = false
  //הצגת משתתף
  sharerDisplay: Sharer = new Sharer(111, "", 1, "", "", "", 1, 1, 1, "", "", "", "")
  ParentDisplaySharer: Parentt = new Parentt(111, "", "", "", "")
  Parent1DisplaySharer: Parentt = new Parentt(111, "", "", "", "")
  StudiesForSharerDisplay: StudiesForSharer = new StudiesForSharer(111, 1, "", "", "", "", "", "")
  displayPopupSharer: boolean = false;
  //ערוך משתתף
  sharerUpdate: Sharer = new Sharer(111, "4444444444", 1, "", "", "", 1, 1, 1, "", "", "", "")
  ParentSharerUpdate: Parentt = new Parentt(111, "", "", "", "")
  Parent1SharerUpdate: Parentt = new Parentt(111, "", "", "", "")
  StudiesForSharerUpdate: StudiesForSharer = new StudiesForSharer(111, 1, "", "", "", "", "", "")
  sUpdateSharer = false
  sharerForProjectUpdate: SharerForProject = new SharerForProject(-1, 1, 1, 1, "", "", this.sharerUpdate)
  //עדכון פרטי חניך בפרויקט
  studentUpdate: Student = new Student(-1, "4444444444", 1, "", "", "", "", 1, 1, 1, "", "", "", "", -1, 1, 1, "", "", "", 1, "", 1, 1, 1, "", "", "")

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
  general() {

    this.api.getGuidesForProjectsWithSudentsAndSharers(this.project.Pr_code).subscribe(Date => {
      this.listAll = []
      this.listAll.push(...Date);
      this.amountSharersAndStudents=0
      this.listAll.forEach(e => {
        this.amountSharersAndStudents+=e.sharers.length+e.students.length
      });
      this.cdRef.detectChanges();
    })

  }
  //הצגת משתתף
  public async displaySharer(s: Sharer): Promise<void> {
    this.sharerDisplay = s;
    //הורה1
    await new Promise<void>((resolve, reject) => {
      const code = this.sharerDisplay?.Sh_father_code;
      if (code != null) {
        this.api.GetParentOfCode(code).subscribe(data => {
          this.ParentDisplaySharer = data;
          resolve();

        });
      }
    })
    //הורה2
    await new Promise<void>((resolve, reject) => {
      const code1 = this.sharerDisplay?.Sh_mother_code;
      if (code1 != null) {
        this.api.GetParentOfCode(code1).subscribe(data => {
          this.Parent1DisplaySharer = data;
          resolve();

        });
      }
    })
    //שליפת לימודים
    await new Promise<void>((resolve, reject) => {
      const code = this.sharerDisplay?.Sh_code;
      if (code != null) {
        this.api.GetStudiesOfCodeSharer(code).subscribe(data => {
          this.StudiesForSharerDisplay = data;
          resolve();

        });
      }
    })
    //רשימת פרויקטים
    await new Promise<void>((resolve, reject) => {
      this.api.getProjectsForSharer(this.sharerDisplay.Sh_code).subscribe(data => {
        this.listSharerForProjects = []
        this.listSharerForProjects.push(...data);
        resolve();
      });
    })
    this.displayPopupSharer = true

  }
  //ערוך משתתף
  async editSharer(sharerForProject: SharerForProject) {
    this.sharerForProjectUpdate = sharerForProject
    this.sharerUpdate = sharerForProject.Sharer
    //שליפת הורים
    await new Promise<void>((resolve, reject) => {

      const code = this.sharerUpdate?.Sh_father_code;
      if (code != null) {
        this.api.GetParentOfCode(code).subscribe(data => {
          this.ParentSharerUpdate = data;
          resolve();

        });
      }
    })

    await new Promise<void>((resolve, reject) => {
      const code1 = this.sharerUpdate?.Sh_mother_code;
      if (code1 != null) {
        this.api.GetParentOfCode(code1).subscribe(data => {
          this.Parent1SharerUpdate = data;
          resolve();

        });
      }
    })
    //שליפת לימודים
    await new Promise<void>((resolve, reject) => {
      const code = this.sharerUpdate?.Sh_code;
      if (code != null) {
        this.api.GetStudiesOfCodeSharer(code).subscribe(data => {
          this.StudiesForSharerUpdate = data;
          resolve();

        });
      }
    })
    this.sUpdateSharer = true

  }
  //רישום חניך ממשתתתף
  async editSharerForStudent(sharerForProject: SharerForProject) {
    this.loading = true
    this.sharer = sharerForProject.Sharer;
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
    //שליפת לימודים ממשתתף
    let studiesForSharer: StudiesForSharer = new StudiesForSharer(-1, 1, "", "", "", "", "", "")
    await new Promise<void>((resolve, reject) => {
      this.api.GetStudiesOfCodeSharer(sharerForProject.Sharer.Sh_code).subscribe(data => {
        studiesForSharer = data;
        resolve();

      },
        error => { resolve() }
      );

    })
    let studiesForStudent: StudiesForStudent = new StudiesForStudent(-1, studiesForSharer.SFS_student_code
      , studiesForSharer.SFS_current_school, studiesForSharer.SFS_current_school_ame, studiesForSharer.SFS_reception_class,
      studiesForSharer.SFS_current_class, studiesForSharer.SFS_previous_institutions, studiesForSharer.SFS_previous_school)

    this.StudiesForStudentNew = studiesForStudent;
    const dataStudentAdd = { data: [this.studentNew, this.ParentNew, this.Parent1New, this.DifficultyStudentNew, studiesForStudent] }

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

        },
          (error) => {
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

        },
          (error) => {
            resolve(); // מסמן שהפעולה הושלמה

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

        },
          (error) => {
            resolve(); // מסמן שהפעולה הושלמה

          });
      }
    })
    //רישום לפרויקט כחניך
    this.studentForProject = new StudentForProject(1, this.project.Pr_code, this.studentNew.St_code, sharerForProject.SFP_code_guide, sharerForProject.SFP_name_school_bein_hazmanim, sharerForProject.SFP_veshinantem, this.studentNew)
    await new Promise<void>((resolve, reject) => {
      this.api.AddStudentForProject(this.studentForProject).subscribe(
        (response) => {
          resolve(); // מסמן שהפעולה הושלמה
          this.studentForProject.SFP_code = (response as StudentForProject).SFP_code
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

  //הצגת חניך
  async displayStudent(s: Student): Promise<void> {
    this.studentDisplay = s;
    //הורה1
    await new Promise<void>((resolve, reject) => {
      const code = this.studentDisplay?.St_father_code;
      if (code != null) {
        this.api.GetParentOfCode(code).subscribe(data => {
          this.ParentDisplay = data;
          resolve();

        });
      }
    })
    //הורה2
    await new Promise<void>((resolve, reject) => {
      const code1 = this.studentDisplay?.St_mother_code;
      if (code1 != null) {
        this.api.GetParentOfCode(code1).subscribe(data => {
          this.Parent1Display = data;
          resolve();

        });
      }
    })
    //שליפת לימודים
    await new Promise<void>((resolve, reject) => {
      const code = this.studentDisplay?.St_code;
      if (code != null) {
        this.api.GetStudiesOfCodeStudent(code).subscribe(data => {
          this.StudiesForStudentDisplay = data;
          resolve();

        });
      }
    })
    //שליפת רשימת קשיים
    await new Promise<void>((resolve, reject) => {
      const code = this.studentDisplay?.St_code;
      if (code != null) {
        this.api.GetDifficultyesOfCodeStudent(code).subscribe(data => {
          this.DifficultyStudentDisplay = []
          this.DifficultyStudentDisplay.push(...data);
          resolve();

        });
      }
    })
    //שליפת פעיל
    await new Promise<void>((resolve, reject) => {
      const code = this.studentDisplay?.St_worker_code;
      if (code != null) {
        this.api.GetWorkerOfCodeStudent(code).subscribe(data => {
          this.WorkerDisplay = data;
          resolve();

        });
      }
    })
    //תמונה
    if (this.studentDisplay.St_image == "yes") {
      await new Promise<void>((resolve, reject) => {
        const imageName = "student" + this.studentDisplay.St_code
        this.api.getStudentImage(imageName)
          .subscribe((data: Blob) => {
            const reader = new FileReader();
            reader.onloadend = () => {
              this.imageBlobURL = reader.result as string;
            };
            reader.readAsDataURL(data);
            resolve();
          }, (error) => resolve());

      })
    }
    //רשימת פרויקטים
    await new Promise<void>((resolve, reject) => {
      this.api.getProjectsForStudent(this.studentDisplay.St_code).subscribe(data => {
        this.listStudentForProjects = []
        this.listStudentForProjects.push(...data);
        resolve();
      });

    })

    this.displayPopup = true

  }
  //ערוך חניך
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
  //ערוך מדריך
  editGuide(guideWithRelations: GuideWithRelations) {

    this.guideForProjectUpdate = guideWithRelations.guide
    this.sUpdateGuide = true
  }
  //מחיקת  מדריך מפרויקט
  deleteGuide(guideWithRelations: GuideWithRelations) {
    if (guideWithRelations.sharers.length == 0 && guideWithRelations.students.length == 0) {

      const dialogRef = this.dialog.open(ConfirmDialogComponent, {
        width: '350px',
        data: { title: 'אישור מחיקה', message: ' :האם למחוק את המדריך' + guideWithRelations.guide.GFP_name + '\n מפרויקט:' + this.project.Pr_name + '?' }
      });
      dialogRef.afterClosed().subscribe(async result => {
        if (result) {

          // קוד לביצוע מחיקה
          await new Promise<void>((resolve, reject) => {

            this.api.deleteGuideForProjects(guideWithRelations.guide.GFP_code).subscribe(
              (message: any) => {
                this.snackBar.open("המדריך נמחק בהצלחה", 'x', { duration: 3000 });
                resolve()
              },
              (error) => {
                this.snackBar.open("שגיאה במחיקת מדריך", 'x', { duration: 3000 });
                resolve()

              });
          });
          this.general();


        }
      });
    }
    else {
      this.snackBar.open("לא ניתן למחוק מדריך שיש תחתיו משתתפים", 'x', { duration: 3000 });

    }
  }
  print() {
    const style = document.createElement('style');
    style.innerHTML = '@media print { @page { size: portrait; } }';
    document.head.appendChild(style);

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
    this.sUpdateGuide = display
    this.general();
  }
  //סגירת פופפ  העברת משתתף לרישום כחניך
  closePAddStudentFromSharer(display: boolean) {
    this.sAddStudentFromSharer = display;
    this.general();
  }
  //סגירת פופפ הצגת חניך
  closePDisplay(display: boolean) {
    this.displayPopup = display
    this.imageBlobURL = ""
  }
  //סגירת פופפ הצגת משתתף
  closePDisplaySharer(display: boolean) {
    this.displayPopupSharer = display
  }
  //סגירת פופפ  ערכית משתתף
  closePUpdateSharer(display: boolean) {
    this.sUpdateSharer = display;
    this.general();
  }
}












