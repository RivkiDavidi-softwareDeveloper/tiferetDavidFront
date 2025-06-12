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

@Component({
  selector: 'app-display-students',
  standalone: true,
  templateUrl: './display-students.component.html',
  styleUrl: './display-students.component.scss',
  imports: [CommonModule, AddUpdateStudentComponent, DisplayStudentComponent, UploadFileExcelComponent]
})
export class DisplayStudentsComponent implements OnInit {
  listOfStudents: Array<Student> = []
  listOfWorkers: Array<Worker> = []
  studentDisplay: Student = new Student(111, "", 1, "", "", "", "", 1, 1, 1, "", "", "", "", 1, 1, 1, "", "", "", 1, "", 1, 1, 1,"")
  ParentDisplay: Parentt = new Parentt(111, "", "", "", "")
  Parent1Display: Parentt = new Parentt(111, "", "", "", "")
  DifficultyStudentDisplay: Array<DifficultyStudent> = []
  WorkerDisplay: Worker = new Worker(111, "", 1, 1, "", "", "", "", "")
  StudiesForStudentDisplay: StudiesForStudent = new StudiesForStudent(111, 1, "", "", "", "", "", "")
  @Input() studentUpdate: Student = new Student(111, "", 1, "", "", "", "", 1, 1, 1, "", "", "", "", 1, 1, 1, "", "", "", 1, "", 1, 1, 1,"")
  @Input() ParentUpdate: Parentt = new Parentt(111, "", "", "", "")
  @Input() Parent1Update: Parentt = new Parentt(111, "", "", "", "")
  @Input() DifficultyStudentUpdate: Array<DifficultyStudent> = []
  @Input() WorkerUpdate: Worker = new Worker(111, "", 1, 1, "", "", "", "", "")
  @Input() StudiesForStudentUpdate: StudiesForStudent = new StudiesForStudent(111, 1, "", "", "", "", "", "")
  @Input() codeWorkerSelected = 0;
  //הגדרות סינונים של חניכים
  //מגדר-1 אב-0
  order = 1;
  genderF = 0;
  statusF = 0;
  workerF = -1;

  //הגדרות סינונים של עובדים
  wgenderO: number = 1
  wgenderF: number = 0
  wtypeWO: number = 0
  wtypeWF: number = 0
  //אחראים על הצגת הפופפ
  sAddStudent: boolean = false;
  @Input() sUpdateStudent: boolean = false;
  sUploadExcel = false
  displayPopup: boolean = false;


  amount: number = 0;
  searchText: string = ""
  orderText = "מגדר";
  filterGG = "הכל";
  filterTT = "הכל"
  filterW = "בחר לפי חונך/פעיל"
  comboBox1: boolean = false;
  comboBox2: boolean = false;
  comboBox3: boolean = false;
  comboBox4: boolean = false;


  clickO1: boolean = false;
  clickO2: boolean = true;
  click1: boolean = true;
  click2: boolean = false;
  click3: boolean = false;

  click4: boolean = true;
  click5: boolean = false;
  click6: boolean = false;
  click7: boolean = false;

  nameParent: string = ""
  nameWorker: string = ""
  @Input() imageBlobURL: string = ""
  @Output() popupDisplayOut: EventEmitter<boolean> = new EventEmitter()

  constructor(private api: ApiService, private cdRef: ChangeDetectorRef, private snackBar: MatSnackBar, public dialog: MatDialog) { }
  ngOnInit(): void {
    this.generalStudents();
    this.generalWorkers();

  }

  //רשימת חניכים
  public generalStudents(): void {
    if (this.codeWorkerSelected != 0) {
      this.workerF = this.codeWorkerSelected;

    }
    this.api.FindStudent(this.searchText, this.order, this.genderF, this.statusF, this.workerF).subscribe(Date => {
      this.listOfStudents = []
      this.listOfStudents.push(...Date);
      this.cdRef.detectChanges();
      this.amount = this.listOfStudents.length

    })
  }
  //רשימת עובדים
  public generalWorkers(): void {
    if (this.clickO2) {
      this.wgenderO = 1
    }
    else {
      this.wgenderO = 0;
    }
    this.wtypeWO = 0;
    //getworkers
    this.api.FindWorker("", this.wgenderO, this.genderF, this.wtypeWO, this.wtypeWF).subscribe(Date => {
      this.listOfWorkers = []
      this.listOfWorkers.push(...Date);
      this.cdRef.detectChanges();
    })
  }
  //שם מצב פעילות
  nameStatus(code: number) {
    if (code == 1) {
      return "פעיל"
    }
    else {
      if (code == 2) {
        return "מושהה"
      }
      else {
        return "סיים"
      }
    }
  }

  //חיפוש
  onInputChange(event: Event) {
    this.searchText = (event.target as HTMLInputElement).value;
    this.api.FindStudent(this.searchText, this.order, this.genderF, this.statusF, this.workerF)
      .subscribe(Date => {
        this.listOfStudents = []
        this.listOfStudents.push(...Date)
        this.amount = this.listOfStudents.length

      })
  }
  //סגירת הפופפ
  closePAdd(display: boolean) {

    this.sAddStudent = display;
    this.sUpdateStudent = display;
    this.generalStudents();
    this.popupDisplayOut.emit(false)
    this.imageBlobURL = ""

  }
  //סגירת פופפ אקסל
  closePUploadExcel(display: boolean) {
    this.sUploadExcel = display;
    this.generalStudents();
    // this.imageBlobURL = ""
  }
  closePDisplay(display: boolean) {

    this.displayPopup = display
    this.imageBlobURL = ""

  }
  //שליפת שם עובד
  public worker(codeWorker: number): string {
    this.listOfWorkers.forEach(w => {
      if (w.Wo_code == codeWorker) {
        this.nameWorker = w.Wo_name + " " + w.Wo_Fname;
      }
    });
    return this.nameWorker;
  }
  //סינון עובד
  onWorkerSelected(event: Event) {
    const workerCode: string = (event.target as HTMLInputElement).value;
    this.workerF = Number(workerCode);
    this.generalStudents()

  }
  //סינון מצב פעילות
  onActivityStatusSelected(event: Event) {
    const status = (event.target as HTMLInputElement).value;
    if (status === "הכל") {
      this.statusF = 0
    }
    else {
      this.statusF = TypeActivityState[status as keyof typeof TypeActivityState];
    }
    this.generalStudents()

  }
  //סינון מגדר
  onGenderSelected(event: Event) {
    const status = (event.target as HTMLInputElement).value;
    if (status === "הכל") {
      this.genderF = 0
    }
    else {
      if (status === "בנים") {
        this.genderF = 1
      }
      else {
        this.genderF = 2
      }
    }
    this.generalStudents()

  }
  // מיון
  onOrderSelected(event: Event) {
    const status = (event.target as HTMLInputElement).value;
    if (status === "מגדר")
      this.order = 1;
    else
      this.order = 0;
    this.generalStudents();
  }


  getCodeByActivityStateName(activityStateName: string): number {
    let code: number = 0;
    Object.values(TypeActivityState).forEach((value: string | number) => {
      if (value === activityStateName) {
        code = TypeActivityState[value as keyof typeof TypeActivityState];
      }
    });
    return code;
  }
  //הצגה מורחבת
  public async display(s: Student): Promise<void> {
    this.studentDisplay = s;
    await new Promise<void>((resolve, reject) => {
      const code = this.studentDisplay?.St_father_code;
      if (code != null) {
        this.api.GetParentOfCode(code).subscribe(data => {
          this.ParentDisplay = data;
          resolve();

        });
      }
    })
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


    this.displayPopup = true

  }
  //ערוך חניך
  async edit(student: Student) {
    this.studentUpdate = student
    //שליפת הורים
    await new Promise<void>((resolve, reject) => {

      const code = this.studentUpdate?.St_father_code;
      if (code != null) {
        this.api.GetParentOfCode(code).subscribe(data => {
          this.ParentUpdate = data;
          resolve();

        });
      }
    })

    await new Promise<void>((resolve, reject) => {
      const code1 = this.studentUpdate?.St_mother_code;
      if (code1 != null) {
        this.api.GetParentOfCode(code1).subscribe(data => {
          this.Parent1Update = data;
          resolve();

        });
      }
    })
    //שליפת לימודים
    await new Promise<void>((resolve, reject) => {
      const code = this.studentUpdate?.St_code;
      if (code != null) {
        this.api.GetStudiesOfCodeStudent(code).subscribe(data => {
          this.StudiesForStudentUpdate = data;
          resolve();

        });
      }
    })
    //שליפת רשימת קשיים
    await new Promise<void>((resolve, reject) => {
      const code = this.studentUpdate?.St_code;
      if (code != null) {
        this.api.GetDifficultyesOfCodeStudent(code).subscribe(data => {
          this.DifficultyStudentUpdate = []
          this.DifficultyStudentUpdate.push(...data);

          resolve();

        });
      }
    })
    //שליפת פעיל
    await new Promise<void>((resolve, reject) => {
      const code = this.studentUpdate?.St_worker_code;
      if (code != null) {
        this.api.GetWorkerOfCodeStudent(code).subscribe(data => {
          this.WorkerUpdate = data;
          resolve();

        });
      }
    })
    //תמונה
    if (this.studentUpdate?.St_image == "yes") {
      await new Promise<void>((resolve, reject) => {
        const imageName = "student" + this.studentUpdate?.St_code
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

    this.sUpdateStudent = true

  }
  //מדפיס
  public print(): void {
    window.print();

  }
  //מוחק חניך
  delete(code: number, name: string): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '350px',
      data: { title: 'אישור מחיקה', message: 'במחיקת חניך נמחקת כל הסטוריית הפעילות עם החניך וכל הקבצים המשויכים אליו. \n האם אתה בטוח שברצונך למחוק את החניך ' + name + '?' }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // קוד לביצוע מחיקה
        this.api.DeleteStudent(code).subscribe(
          (response) => {
            this.snackBar.open('!החניך נמחק בהצלחה', 'x', { duration: 3000 });
            this.generalStudents();
          },
          (error) => {
            this.snackBar.open('תהליך המחיקה נכשל', 'x', { duration: 3000 });

          }
        )
      } else { }
    });
  }
  //שם מיון
  nameOrder() {
    if (this.order == 0) {
      return "א,ב"

    }
    return "מגדר"

  }
  //שם סינון
  nameFilterWorker() {
    if (this.workerF == -1) {
      return "הכל"
    }
    var name = ""
    this.listOfWorkers.forEach(w => {
      if (w.Wo_code == this.workerF)
        name = w.Wo_name + " " + w.Wo_Fname
    })
    return name;
  }

  nameFilterGender() {
    if (this.genderF == 0) {
      return "הכל"
    }
    if (this.genderF == 1) {
      return "בנים"
    }
    return "בנות"

  }
  nameFilterActivityStatus() {
    if (this.statusF == 0) {
      return "הכל"
    }
    if (this.statusF == 1) {
      if (this.genderF == 0) {
        return "פעילים/ות"
      }
      if (this.genderF == 1) {
        return "פעילים"
      }
      return "פעילות"
    }
    if (this.statusF == 2) {
      if (this.genderF == 0) {
        return "מושהים/ות"
      }
      if (this.genderF == 1) {
        return "מושהים"
      }
      return "מושהות"
    }
    return "סיימו"

  }

}


/*
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

@Component({
  selector: 'app-display-students',
  standalone: true,
  templateUrl: './display-students.component.html',
  styleUrl: './display-students.component.scss',
  imports: [CommonModule, AddUpdateStudentComponent, DisplayStudentComponent, UploadFileExcelComponent]
})
export class DisplayStudentsComponent implements OnInit {
  listOfStudents: Array<Student> = []
  listOfWorkers: Array<Worker> = []
  parent1: Parentt = new Parentt(1, "", "", "", "")
  parent2: Parentt = new Parentt(1, "", "", "", "")


  studentDisplay: Student = new Student(111, "", 1, "", "", "", "", 1, 1, 1, "", "", "", "", 1, 1, 1, "", "", "", 1, "", 1, 1, 1, this.parent1, this.parent2)
  @Input() studentUpdate: Student = new Student(111, "", 1, "", "", "", "", 1, 1, 1, "", "", "", "", 1, 1, 1, "", "", "", 1, "", 1, 1, 1, this.parent1, this.parent2)
  studiesDisplay: StudiesForStudent = new StudiesForStudent(1, 1, "", "", "", "", "", "");

  listOfStudiesForStudens: Array<StudiesForStudent> = [];
  listOfDifficulties: Array<DifficultyStudent> = []
  @Input() listOfDifficultiesUpdate: Array<DifficultyStudent> = []
  listOfDifficultiesDisplay: Array<DifficultyStudent> = []


  @Input() codeWorkerSelected = 0;
  //הגדרות סינונים של חניכים
  //מגדר-1 אב-0
  order = 1;
  genderF = 0;
  statusF = 0;
  workerF = -1;

  //הגדרות סינונים של עובדים
  wgenderO: number = 1
  wgenderF: number = 0
  wtypeWO: number = 0
  wtypeWF: number = 0
  //אחראים על הצגת הפופפ
  sAddStudent: boolean = false;
  @Input() sUpdateStudent: boolean = false;
  sUploadExcel = false
  displayPopup: boolean = false;


  amount: number = 0;
  searchText: string = "null"
  orderText = "מגדר";
  filterGG = "הכל";
  filterTT = "הכל"
  filterW = "בחר לפי חונך/פעיל"
  comboBox1: boolean = false;
  comboBox2: boolean = false;
  comboBox3: boolean = false;
  comboBox4: boolean = false;


  clickO1: boolean = false;
  clickO2: boolean = true;
  click1: boolean = true;
  click2: boolean = false;
  click3: boolean = false;

  click4: boolean = true;
  click5: boolean = false;
  click6: boolean = false;
  click7: boolean = false;

  nameParent: string = ""
  nameWorker: string = ""
  @Input() imageBlobURL: string = ""
  @Output() popupDisplayOut: EventEmitter<boolean> = new EventEmitter()

  constructor(private api: ApiService, private cdRef: ChangeDetectorRef, private snackBar: MatSnackBar, public dialog: MatDialog) { }
  ngOnInit(): void {
    this.generalStudents();
    this.generalWorkers();
    this.generalStudiesForStudens();
    this.generalDifficultiesStudents();
  }

  //רשימת חניכים
  public generalStudents(): void {
    if (this.codeWorkerSelected != 0) {
      this.workerF = this.codeWorkerSelected;

    }
    this.api.getStudents(this.order, this.genderF, this.statusF, this.workerF).subscribe(Date => {
      this.listOfStudents = []
      this.listOfStudents.push(...Date);
      this.cdRef.detectChanges();
    })
    this.amountW();
  }
  //קשיים
  public generalDifficultiesStudents() {
    this.api.getDifficultiesStudents().subscribe(Date => {
      this.listOfDifficulties = []
      this.listOfDifficulties.push(...Date);
    })
  }
  //רשימת עובדים
  public generalWorkers(): void {
    if (this.clickO2) {
      this.wgenderO = 1
    }
    else {
      this.wgenderO = 0;
    }
    this.wtypeWO = 0;

    this.api.getWorkers(this.wgenderO, this.genderF, this.wtypeWO, this.wtypeWF).subscribe(Date => {
      this.listOfWorkers = []
      this.listOfWorkers.push(...Date);
      this.cdRef.detectChanges();
    })
  }
  //רשימת לימודים
  public generalStudiesForStudens() {
    this.api.getStudiesForStudens().subscribe(Date => {
      this.listOfStudiesForStudens = []
      this.listOfStudiesForStudens.push(...Date);
      this.cdRef.detectChanges();
    })

  }
  //שם מצב פעילות
  nameStatus(code: number) {
    if (code == 1) {
      return "פעיל"
    }
    else {
      if (code == 2) {
        return "מושהה"
      }
      else {
        return "סיים"
      }
    }
  }
  //כמות
  amountW() {
    this.api.getAmountStudents(this.searchText, this.order, this.genderF, this.statusF, this.workerF)
      .subscribe(Date => { this.amount = Date })

  }
  //חיפוש
  onInputChange(event: Event) {
    this.searchText = (event.target as HTMLInputElement).value;
    if (this.searchText === "")
      this.searchText = "null"
    this.api.FindStudent(this.searchText, this.order, this.genderF, this.statusF, this.workerF)
      .subscribe(Date => {
        this.listOfStudents = []
        this.listOfStudents.push(...Date)

      })
    if (this.searchText === "null") {
      this.generalStudents();
    }
    else {
      this.amountW();
    }
  }
  //סגירת הפופפ
  closePAdd(display: boolean) {
    this.sAddStudent = display;
    this.sUpdateStudent = display;
    this.generalStudents();
    this.generalStudiesForStudens()
    this.generalDifficultiesStudents();
    this.popupDisplayOut.emit(false)
    this.imageBlobURL = ""
  }
  closePUploadExcel(display: boolean) {
    this.sUploadExcel = display;
    this.generalStudents();
    this.generalStudiesForStudens()
    this.generalDifficultiesStudents();
   // this.imageBlobURL = ""
  }
  closePDisplay(display: boolean) {

    this.displayPopup = display
    this.imageBlobURL = ""

  }
  //שליפת שם עובד
  public worker(codeWorker: number): string {
    this.listOfWorkers.forEach(w => {
      if (w.Wo_code == codeWorker) {
        this.nameWorker = w.Wo_name + " " + w.Wo_Fname;
      }
    });
    return this.nameWorker;
  }
  //סינון עובד
  onWorkerSelected(event: Event) {
    const workerCode: string = (event.target as HTMLInputElement).value;
    this.workerF = Number(workerCode);
    this.generalStudents()

  }
  //סינון מצב פעילות
  onActivityStatusSelected(event: Event) {
    const status = (event.target as HTMLInputElement).value;
    if (status === "הכל") {
      this.statusF = 0
    }
    else {
      this.statusF = TypeActivityState[status as keyof typeof TypeActivityState];
    }
    this.generalStudents()

  }
  //סינון מגדר
  onGenderSelected(event: Event) {
    const status = (event.target as HTMLInputElement).value;
    if (status === "הכל") {
      this.genderF = 0
    }
    else {
      if (status === "בנים") {
        this.genderF = 1
      }
      else {
        this.genderF = 2
      }
    }
    this.generalStudents()

  }
  // מיון
  onOrderSelected(event: Event) {
    const status = (event.target as HTMLInputElement).value;
    if (status === "מגדר")
      this.order = 1;
    else
      this.order = 0;
    this.generalStudents();
  }


  getCodeByActivityStateName(activityStateName: string): number {
    let code: number = 0;
    Object.values(TypeActivityState).forEach((value: string | number) => {
      if (value === activityStateName) {
        code = TypeActivityState[value as keyof typeof TypeActivityState];
      }
    });
    return code;
  }
  //הצגה מורחבת
  public async display(s: Student): Promise<void> {
    await new Promise<void>((resolve, reject) => {

      this.listOfDifficultiesDisplay = []
      //קשייים
      this.listOfDifficulties.forEach(d => {
        if (d.DS_student_code == s.St_code) {
          this.listOfDifficultiesDisplay.push(d);
        }
      });
      //לימודים

      this.listOfStudiesForStudens.forEach(stu => {
        if (stu.SFS_student_code == s.St_code) {
          console.log(stu)
          this.studiesDisplay.SFS_code = stu.SFS_code
          this.studiesDisplay.SFS_current_class = stu.SFS_current_class;
          this.studiesDisplay.SFS_current_school = stu.SFS_current_school;
          this.studiesDisplay.SFS_current_school_ame = stu.SFS_current_school_ame;
          this.studiesDisplay.SFS_previous_institutions = stu.SFS_previous_institutions
          this.studiesDisplay.SFS_previous_school = stu.SFS_previous_school;
          this.studiesDisplay.SFS_reception_class = stu.SFS_reception_class
          this.studiesDisplay.SFS_student_code = stu.SFS_student_code;
        }
      });
      this.studentDisplay = s;
      //תמונה
      const imageName = this.studentUpdate.St_image
      if (imageName) {
         this.api.getImageStudent(imageName)
          .subscribe((data: Blob) => {
            const reader = new FileReader();
            reader.onloadend = () => {
              this.imageBlobURL = reader.result as string;
            };
            reader.readAsDataURL(data);
          });
      }
      resolve();
    })
    this.displayPopup = true
  }
  //מדפיס
  public print(): void {
    window.print();

  }
  //מוחק חניך
  delete(code: number, name: string): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '350px',
      data: { title: 'אישור מחיקה', message: 'במחיקת חניך נמחקת כל הסטוריית הפעילות עם החניך וכל הקבצים המשויכים אליו. \n האם אתה בטוח שברצונך למחוק את החניך ' + name + '?' }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // קוד לביצוע מחיקה
        this.api.DeleteStudent(code).subscribe(
          (response) => {
            this.snackBar.open('!החניך נמחק בהצלחה', 'x', { duration: 3000 });
            this.generalStudents();
          },
          (error) => {
            this.snackBar.open('תהליך המחיקה נכשל', 'x', { duration: 3000 });

          }
        )
      } else { }
    });
  }
  //ערוך חניך
  async edit(student: Student) {
    await new Promise<void>((resolve, reject) => {
      //קשייים
      this.listOfDifficultiesUpdate = []
      this.listOfDifficulties.forEach(d => {
        if (d.DS_student_code == student.St_code) {
          this.listOfDifficultiesUpdate.push(d);
        }
      });
      console.log(this.listOfDifficultiesUpdate)
      //לימודים
      this.listOfStudiesForStudens.forEach(s => {
        if (s.SFS_student_code == student.St_code) {
          console.log(s)
          this.studiesUpdate.SFS_code = s.SFS_code
          this.studiesUpdate.SFS_current_class = s.SFS_current_class;
          this.studiesUpdate.SFS_current_school = s.SFS_current_school;
          this.studiesUpdate.SFS_current_school_ame = s.SFS_current_school_ame;
          this.studiesUpdate.SFS_previous_institutions = s.SFS_previous_institutions
          this.studiesUpdate.SFS_previous_school = s.SFS_previous_school;
          this.studiesUpdate.SFS_reception_class = s.SFS_reception_class
          this.studiesUpdate.SFS_student_code = s.SFS_student_code;
        }
      });
      this.studentUpdate = student
      //תמונה
      const imageName = this.studentUpdate.St_image
      if (imageName) {
        this.api.getImageStudent(imageName)
          .subscribe((data: Blob) => {
            const reader = new FileReader();
            reader.onloadend = () => {
              this.imageBlobURL = reader.result as string;
            };
            reader.readAsDataURL(data);
          });
      }
      resolve();
    })
    this.sUpdateStudent = true
  }
  //שם מיון
  nameOrder() {
    if (this.order == 0) {
      return "א,ב"

    }
    return "מגדר"

  }
  //שם סינון
  nameFilterWorker() {
    if (this.workerF == -1) {
      return "הכל"
    }
    var name = ""
    this.listOfWorkers.forEach(w => {
      if (w.Wo_code == this.workerF)
        name = w.Wo_name + " " + w.Wo_Fname
    })
    return name;
  }

  nameFilterGender() {
    if (this.genderF == 0) {
      return "הכל"
    }
    if (this.genderF == 1) {
      return "בנים"
    }
    return "בנות"

  }
  nameFilterActivityStatus() {
    if (this.statusF == 0) {
      return "הכל"
    }
    if (this.statusF == 1) {
      if (this.genderF == 0) {
        return "פעילים/ות"
      }
      if (this.genderF == 1) {
        return "פעילים"
      }
      return "פעילות"
    }
    if (this.statusF == 2) {
      if (this.genderF == 0) {
        return "מושהים/ות"
      }
      if (this.genderF == 1) {
        return "מושהים"
      }
      return "מושהות"
    }
    return "סיימו"

  }

}
*/
