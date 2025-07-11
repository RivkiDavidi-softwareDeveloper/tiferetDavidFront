import { Component, EventEmitter, Input, OnInit, Output, HostListener, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivityReportingComponent } from "../activity-reporting/activity-reporting.component";
import { DisplayStudentsComponent } from "../display-students/display-students.component";
import { TasksComponent } from "../tasks/tasks.component";
import { WorkerInquiriesComponent } from "../worker-inquiries/worker-inquiries.component";
import { Worker } from '../../models/worker.class';
import { ApiService } from '../../services/api.service';
import { Student } from '../../models/student.class';
import { ContactToProjectComponent } from "../contact-to-project/contact-to-project.component";
import { Parentt } from '../../models/parent.class';
import { StudiesForStudent } from '../../models/studiesForStudent.class';
import { DifficultyStudent } from '../../models/difficultyStudent.class';
import { DeshbordComponent } from "../deshbord/deshbord.component";
import { ReportsComponent } from "../reports/reports.component";

@Component({
  selector: 'app-workers-login',
  standalone: true,
  templateUrl: './workers-login.component.html',
  styleUrls: ['./workers-login.component.scss'],
  imports: [CommonModule, ActivityReportingComponent, DisplayStudentsComponent, TasksComponent, WorkerInquiriesComponent, ContactToProjectComponent, DeshbordComponent, ReportsComponent]
})


export class WorkersLoginComponent implements OnInit {
  deshbord = true
  active: boolean = false;
  students: boolean = false;
  task: boolean = false;
  projects: boolean = false;
  pz: boolean = false;
  reports=false
  Astudents: Array<Student> = []
  amountMessagesND = 0
  amountTasksND = 0
  //מעבר לעדכון חניך מדיווח על פעילות
  displayUpdateStudent = false
  studentUpdate: Student = new Student(111, "", 1, "", "", "", "", 1, 1, 1, "", "", "", "", 1, 1, 1, "", "", "", 1, "", 1, 1, 1,"","","")
  ParentUpdate: Parentt = new Parentt(111, "", "", "", "")
  Parent1Update: Parentt = new Parentt(111, "", "", "", "")
  DifficultyStudentUpdate: Array<DifficultyStudent> = []
  WorkerUpdate: Worker = new Worker(111, "", 1, 1, "", "", "", "", "",1)
  StudiesForStudentUpdate: StudiesForStudent = new StudiesForStudent(111, 1, "", "", "", "", "", "")
  imageBlobURL: string = ""


  @Input() worker: Worker = new Worker(1, "", 1, 1, "", "", "", "", "",1);
  @Output() popupDisplayOut: EventEmitter<boolean> = new EventEmitter()
  @Input() minutes = 0;
  @Input() kilomet = 0;
  @Input() exit = "";
  @Input() target = "";

  audio: HTMLAudioElement;
  degelAudioTask = false;
  degelAudioMessege = false;

  constructor(private api: ApiService, private cdRef: ChangeDetectorRef) {
    // יצירת אובייקט אודיו והגדרת הנתיב לקובץ האודיו
    this.audio = new Audio();
    const audioName = 'glocken.mp3';
    this.audio.src = `assets/${audioName}`;;
    this.audio.load();
  }
  ngOnInit(): void {
    this.startInactivityTimer();
    this.amoumtMessagesNotDone();
    this.amoumtTasksNotDone();

  }
  checkCondition(): void {
    // אם התנאי מתקיים, נגן את הצליל
    if (this.amountTasksND > 0) {
      this.audio.play();
    }
  }
  onListSelected(event: Event) {
    this.deshbord = false
    this.active = false;
    this.students = false;
    this.task = false;
    this.projects = false;
    this.pz = false;
    this.reports=false
    const value = Number((event.target as HTMLInputElement).value);
    switch (value) {
      case 1: this.deshbord = true; break;
      case 2: this.active = true; break;
      case 3: this.students = true; break;
      case 4: this.task = true; break;
      case 5: this.pz = true; break;
      case 6: this.projects = true; break;
      default: this.deshbord = true;

    }
  }
  //סגירת הפופפ
  public close(): void {
    this.popupDisplayOut.emit(false)
  }
  //יציאה לאחר 5 דקות של חוסר פעילות

  private inactivityTimer: any;
  private readonly inactivityDuration: number = 5 * 60 * 1000; // 5 minutes in milliseconds


  startInactivityTimer(): void {
    this.inactivityTimer = setTimeout(() => {
      this.popupDisplayOut.emit(false)

    }, this.inactivityDuration);
  }
  resetInactivityTimer(): void {
    clearTimeout(this.inactivityTimer);
    this.startInactivityTimer();
  }
  @HostListener('document:mousemove')
  @HostListener('document:keypress')
  @HostListener('document:click')
  @HostListener('document:scroll')
  onActivity(): void {
    this.resetInactivityTimer();
  }
  //כמות הודעות שלא נקראו
  amoumtMessagesNotDone() {
   /*  this.api.GetAmoumtMessagesNotDoneForWorker(this.worker.Wo_code).subscribe(Date => {
      this.amountMessagesND = Number(Date);
      this.cdRef.detectChanges();
      if (!this.degelAudioMessege) {
        this.checkCondition()
        this.degelAudioMessege = true
      }
    }); */
  }
  //כמות משימות שלא התבצעו
  amoumtTasksNotDone() {
    this.api.GetAmoumtTasksNotDoneForWorker(this.worker.Wo_code).subscribe(Date => {
      this.amountTasksND = Number(Date);
      this.cdRef.detectChanges();
      if (!this.degelAudioTask) {
        this.checkCondition()
        this.degelAudioTask = true
      }
    });
  }
  updateAmountTask() {
    this.amoumtTasksNotDone()
  }

  //מעבר לעדכון חניך 
  async updateStudent(student: Student) {
    this.studentUpdate = student
    //שליפת אבא
    await new Promise<void>((resolve, reject) => {
      const code = this.studentUpdate?.St_father_code;
      if (code != null) {
        this.api.GetParentOfCode(code).subscribe(data => {
          this.ParentUpdate = data;
          resolve();

        });
      }
    })
    //שליפת אמא
    await new Promise<void>((resolve, reject) => {
      const code = this.studentUpdate?.St_mother_code;
      if (code != null) {
        this.api.GetParentOfCode(code).subscribe(data => {
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
      if (code!= null) {
        this.api.GetDifficultyesOfCodeStudent(code).subscribe(data => {
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
    /*     await new Promise<void>((resolve, reject) => {
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
        }) */
    this.displayUpdateStudent = true;
    this.active = false;
    this.students = true;
  }
  closePAdd(display: boolean) {
    this.displayUpdateStudent = false;
    this.imageBlobURL = ""
  }
}
