import { ChangeDetectorRef, Component, OnDestroy, OnInit, EventEmitter, Input, Output } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { CommonModule, Time } from '@angular/common';
import { StudentComponent } from "../student/student.component";
import { Student } from '../../models/student.class';
import { Worker } from '../../models/worker.class';
import { ApiService } from '../../services/api.service';
import { Parentt } from '../../models/parent.class';
import { Activity } from '../../models/activity.class';
import { StudentForActivity } from '../../models/studentForActivity.class';
import { CategoriesForActivity } from '../../models/categoriesForActivity.class';
import { StudiesForStudent } from '../../models/studiesForStudent.class';
import { NgSelectModule } from '@ng-select/ng-select';
import { MatSnackBar } from '@angular/material/snack-bar';
import { PastFrequencyComponent } from "../past-frequency/past-frequency.component";
import { SubcategoryForTypeActivity } from '../../models/subcategoryForTypeActivity.class';
import { TypeOfActivity } from '../../models/TypeOfActivity.enum';
import { FileUploadComponent } from "../file-upload/file-upload.component";
import { AddActivityRequest } from '../../models/AddActivityRequest.class';
import { LoadingSpinnerComponent } from "../loading-spinner/loading-spinner.component";
import { TaskComponent } from "../task/task.component";
import { response } from 'express';
import { ReportsComponent } from "../reports/reports.component";
import { ActivityReportingForStudentComponent } from "../activity-reporting-for-student/activity-reporting-for-student.component";

@Component({
    selector: 'app-activity-reporting',
    standalone: true,
    templateUrl: './activity-reporting.component.html',
    styleUrls: ['./activity-reporting.component.scss'],

    imports: [CommonModule, StudentComponent, NgSelectModule, PastFrequencyComponent, FileUploadComponent, LoadingSpinnerComponent, TaskComponent, ReportsComponent, ActivityReportingForStudentComponent]
})

export class ActivityReportingComponent implements OnInit, OnDestroy {
    //סינכרון נתונים בין לקוחות
    socket: Socket | undefined;
    ngOnDestroy(): void {
        if (this.socket)
            this.socket.disconnect();
    }
    connectSocket(): void {
        /*        this.socket = io(this.api.urlBasisSocket, {
                   transports: ["polling"]
               });
               this.socket = io(this.api.urlBasisSocket, {
                   transports: ["websocket"]
               });
       
               this.socket.on("activities-updated", () => {
                   this.generalActivities();
                   this.generalCategories();
               });
               this.socket.on("students-updated", async () => {
                   await new Promise<void>((resolve, reject) => {
                       this.generalStudents(1);
                       resolve(); // מסמן שהפעולה הושלמה
                   });
               });
                */
    }
    //עריכת חניך מדיווח על פעילות
    @Output() editStudent: EventEmitter<Student> = new EventEmitter()

    //היסטוריית פעילות
    listOfAcitivities: Array<Activity> = [];
    listOfCategoriesForActivity: Array<CategoriesForActivity> = [];
    //האם להוסיף חד פעמי
    displayAddStudent = false

    text = 'בחר מרשימה';
    showList: boolean = false;
    timerr: boolean = false;
    //עובד
    @Input() worker: Worker = new Worker(1, "", 1, 1, "", "", "", "", "", 1)

    //רשימת חניכים
    listOfStudents: Array<Student> = [];
    //רשימת חניכים תדירות
    listOfStudents2: Array<Student> = [];

    statusF = 1;
    //החניך שנבחר
    addStudent: Student = new Student(0, "", 1, "", "", "", "", undefined, undefined, undefined, "", "", "", "", 1, 1, undefined, "", "", "", undefined, "", undefined, undefined, undefined, "", "", "");

    listSelectedStudents: Array<StudentForActivity> = [];
    //תאריך וטטימר
    @Input() selectedDate: Date = new Date(); // התאריך הנוכחי כברירת מחדל
    @Input() minutes = 0;
    @Input() kilomet = 0
    @Input() exit = ""
    @Input() target = ""
    minutesCC = 0;

    time: Date = new Date();



    //inputValue = 'משתתף חד פעמי';


    displayTimeTimer = 1
    displayGroupActivities = false;       //פעילות קבוצתית
    displayallList = false        //כל החנכים  
    displaystudentActive = true  //רק פעילים    
    displaystudentFinish = false     //רק שסיימו
    displaystudentSuspended = false  //רק מושהים

    displayToday = true          //היום
    displayYesterday = false      //אתמול
    displayBeforeYesterday = false    //שלשום

    displayFileUpload = false //האם להציג אפשרות להוספת קבצים
    displayM5 = false;
    displayM10 = false
    displayM20 = false
    displayM30 = false
    displayM40 = false
    displayM50 = false

    displayH1 = false
    displayH2 = false
    displayH3 = false
    displayH4 = false



    //הוספת פעילות
    AFS_date = `${this.selectedDate.getFullYear()}-${(this.selectedDate.getMonth() + 1).toString().padStart(2, '0')}-${this.selectedDate.getDate().toString().padStart(2, '0')}`;
    AFS_activity_time = 0
    AFS_exit = ""
    AFS_target = ""
    AFS_kilometer = 0

    validAFS_exit = false
    validAFS_target = false


    validNane = false
    validNameF = false


    isSelect: boolean = false;
    textInput: string = '';
    selectedOption: number = 1;
    //פופפ חניכים בתדירות מוגזמת:)
    displayPopap = false;
    //סטטוס האנימציה
    loading = false;
    //צליל 
    audio: HTMLAudioElement;

    //סגירת הפופפ
    closeP(display: boolean) {
        this.displayPopap = display;
    }

    constructor(private api: ApiService, private cdRef: ChangeDetectorRef, private snackBar: MatSnackBar) {
        this.time.setHours(0);
        this.time.setMinutes(0);
        this.AFS_date = `${this.selectedDate.getFullYear()}-${(this.selectedDate.getMonth() + 1).toString().padStart(2, '0')}-${this.selectedDate.getDate().toString().padStart(2, '0')}`;
        // יצירת אובייקט אודיו והגדרת הנתיב לקובץ האודיו
        this.audio = new Audio();
        const audioName = 'glocken.mp3';
        this.audio.src = `assets/${audioName}`;;
        this.audio.load();
    }
    checkCondition(): void {
        // אם התנאי מתקיים, נגן את הצליל
        if (this.displayPopap) {
            this.audio.play();
        }
    }

    async ngOnInit(): Promise<void> {
  /*       this.api.DeleteActi().subscribe(
                  (response) => {
                    this.snackBar.open('!הפעילויות נמחק בהצלחה', 'x', { duration: 3000 });
                  },
                  (error) => {
                    this.snackBar.open('תהליך המחיקה נכשל', 'x', { duration: 3000 });
        
                  }
                ) */
        await new Promise<void>((resolve, reject) => {
            this.generalStudents(1);
            resolve(); // מסמן שהפעולה הושלמה
        });
        this.onTimerSelected(1)

        this.connectSocket()
        //this.generalStudents2()
        // קוד לביצוע מחיקה

    }

    /*     //רשימת הפעילויות
        generalActivities() {
            if (!this.displayGroupActivities) {
                this.api.FindActivities("", "", 1, this.worker.Wo_gender, this.worker.Wo_code, this.listSelectedStudents[0].SFA_code_student, 0, new Date().getFullYear(), 0).subscribe(Date => {
                    this.listOfAcitivities = [];
                    this.listOfAcitivities.push(...Date);
                    this.cdRef.detectChanges();
                });
            }
    
        }      // רשימת קטגוריות לפעילות
        generalCategories() {
            this.api.getCategories().subscribe(Date => {
                this.listOfCategoriesForActivity = [];
                this.listOfCategoriesForActivity.push(...Date);
                this.cdRef.detectChanges();
            });
        } 
        //שמות הקטגוריות
        namesCategories(codeActivity: number) {
            var listOfCategories2: Array<CategoriesForActivity> = []
    
            this.listOfCategoriesForActivity.forEach(c => {
                if (c.CFA_code_activity == codeActivity) {
                    listOfCategories2.push(c);
                }
            })
            return listOfCategories2;
        }
        //שם קטגוריה
        nameCategory(codeCategory: number) {
            if (codeCategory == 0) {
                return "---"
            }
            var name = "";
            for (var i = 1; i <= 8; i++) {
                if (codeCategory == i) {
                    name = TypeOfActivity[i];
                }
            }
            return name;
        }
            */
    //רשימת חניכים
    async generalStudents(ifFrequency: number): Promise<void> {
        await new Promise<void>((resolve, reject) => {
            this.api.FindStudent("", 0, 0, this.statusF, this.worker.Wo_code).subscribe(Date => {
                this.listOfStudents = []
                this.listOfStudents.push(...Date);
                this.cdRef.detectChanges();
                resolve(); // מסמן שהפעולה הושלמה
            });
        })
        if (ifFrequency == 1) {
            var lastDate = ""
            await new Promise<void>(async (resolve, reject) => {
                this.listOfStudents2 = []
                await new Promise<void>((resolve, reject) => {
                    this.listOfStudents.forEach(s => {
                        this.api.getLastActivityForStudent(s.St_code).subscribe(Date => {
                            lastDate = Date;
                            if (lastDate) {
                                if (this.ifRedPoit(lastDate, s)) {
                                    this.listOfStudents2.push(s)
                                    this.displayPopap = true
                                    this.checkCondition()
                                }
                            }
                            else {
                                this.listOfStudents2.push(s)
                                this.displayPopap = true
                                this.checkCondition()
                            }
                        })
                        resolve(); // מסמן שהפעולה הושלמה
                    });
                });

                resolve(); // מסמן שהפעולה הושלמה
            });
            if (this.listOfStudents2.length == 0) {
                this.displayPopap = false
            }
        }
        else {
            var lastDate = ""
            await new Promise<void>(async (resolve, reject) => {
                this.listOfStudents2 = []
                await new Promise<void>((resolve, reject) => {
                    this.listOfStudents.forEach(s => {
                        this.api.getLastActivityForStudent(s.St_code).subscribe(response => {
                            lastDate = response;
                            if (lastDate) {
                                if (this.ifRedPoit(lastDate, s)) {
                                    this.listOfStudents2.push(s)
                                }
                            }
                            else {
                                this.listOfStudents2.push(s)
                            }
                        })
                        resolve(); // מסמן שהפעולה הושלמה
                    });
                });

                resolve(); // מסמן שהפעולה הושלמה
            });
            if (this.listOfStudents2.length == 0) {
                this.displayPopap = false

            }
        }

    }


    toggleInputType() {
        this.isSelect = !this.isSelect;
        if (!this.isSelect) {
            this.selectedOption = 1; // אפסי את הבחירה במידה וסוג הקלט שוחזר להיות טקסט
        } else {
            this.textInput = ''; // אפסי את הטקסט שהוזן במידה וסוג הקלט השתנה להיות בחירה מרשימה
        }
    }
    onSelect(event: Event) {
        this.textInput = (event.target as HTMLInputElement).value

    }
    onTextInput(event: Event) {
        this.textInput = (event.target as HTMLInputElement).value
    }
    //שם
    onInputChangeN(event: Event) {
        const name: string = (event.target as HTMLInputElement).value
        if (name.length <= 20) {
            this.addStudent.St_name = name;
            this.validNane = false;
        }
        else {
            this.validNane = true;
        }
    }
    //שם משפחה
    onInputChangeNF(event: Event) {
        const namef: string = (event.target as HTMLInputElement).value
        if (namef.length <= 20) {
            this.addStudent.St_Fname = namef
            this.validNameF = false;
        }
        else {
            this.validNameF = true;
        }
    }
    //האם זמן התדירות עבר
    ifRedPoit(lastDate: string, student: Student): boolean {
        if (lastDate === "אין")
            return true;
        const parts = lastDate.split('-'); // פיצול התאריך לתתי חלקים על פי המחלקים ביניהם קווים מפרידים
        const year = parseInt(parts[0], 10); // המרת החלק הראשון למספר שלם
        const month = parseInt(parts[1], 10); // המרת החלק השני למספר שלם
        const day = parseInt(parts[2], 10); // המרת החלק השלישי למספר שלם
        const date = new Date(year, month - 1, day); // יצירת אובייקט תאריך מהערכים המקובלים
        var amount = 1
        //בימים
        if (student.St_code_frequency == 1) {
            if (student.St_amount_frequency)
                amount = student.St_amount_frequency;
        }
        //בשבועות 
        if (student.St_code_frequency == 2) {
            if (student.St_amount_frequency)
                amount = student.St_amount_frequency * 7;
        }
        //בחודשים
        if (student.St_code_frequency == 3) {
            if (student.St_amount_frequency)
                amount = student.St_amount_frequency * 30;
        }
        let today = new Date(); // תאריך היום הנוכחי
        let pastDate = new Date(today.getTime() - (amount * 24 * 60 * 60 * 1000)); // חישוב התאריך שנמצא amount ימים אחורה
        if (date >= pastDate) {
            return false;
        }
        else {
            return true;
        }
    }

    ifSelected(code: number): boolean {
        var d = false
        this.listSelectedStudents.forEach(st => {
            if (st.SFA_code_student == code) {
                d = true;
            }
        });
        return d;
    }
    //בחירת חניך מהרשימה
    onStudentSelected(event: Event) {
        const codeStuent = Number((event.target as HTMLInputElement).value);
        if (this.displayGroupActivities) {
            const studentForActivity: StudentForActivity = new StudentForActivity(0, 0, codeStuent,undefined)
            this.listSelectedStudents.push(studentForActivity)
            this.cdRef.detectChanges();
        }
        else {
            this.listSelectedStudents = [];
            const studentForActivity: StudentForActivity = new StudentForActivity(0, 0, codeStuent,undefined)
            this.listSelectedStudents.push(studentForActivity)
            this.cdRef.detectChanges();
        }
    }
    //בחירת חניך מהתמונות
    selectStudentBoxAdd(codeStuent: number) {
        console.log("חניך" + codeStuent)
        if (this.displayGroupActivities) {
            const studentForActivity: StudentForActivity = new StudentForActivity(0, 0, codeStuent,undefined)
            this.listSelectedStudents.push(studentForActivity)
            this.cdRef.detectChanges();

        }
        else {
            this.listSelectedStudents = []
            const studentForActivity: StudentForActivity = new StudentForActivity(0, 0, codeStuent,undefined)
            this.listSelectedStudents.push(studentForActivity)
            this.cdRef.detectChanges();
            /*    this.generalActivities()
               this.generalCategories() */
        }

    }
    selectStudentBoxDelete(codeStuent: number) {
        this.listSelectedStudents.forEach((s, index) => {
            if (s.SFA_code_student === codeStuent) {
                this.listSelectedStudents.splice(index, 1);

            }
        });
        /*         this.generalActivities()
                this.generalCategories() */
        this.cdRef.detectChanges();
    }
    convertToStudent(student: StudentForActivity) {
        return this.listOfStudents.find(s => s.St_code == student.SFA_code_student)
    }


    //בחירת מונה
    onTimerSelected(codeTimer: number) {
        this.displayTimeTimer = codeTimer;
        //מונה זמן או מונה דרך
        if (codeTimer == 1 || codeTimer == 2) {
            this.time = new Date();
            const hours = Math.floor(this.minutes / 60);
            const minutes = Math.floor(this.minutes - hours * 60);
            this.time.setHours(hours);
            this.time.setMinutes(minutes);
            this.AFS_activity_time = this.minutes;
            this.displayM10 = false; this.displayM20 = false; this.displayM30 = false; this.displayM40 = false; this.displayM50 = false;
            this.displayH1 = false; this.displayH2 = false; this.displayH3 = false; this.displayH4 = false;
        }
        //מונה דרך
        if (codeTimer == 2) {
            this.AFS_kilometer = this.kilomet;
            this.AFS_exit = this.exit;
            this.AFS_target = this.target
        }


    }
    //בחירת תאריך
    today() {
        this.selectedDate = new Date();
        this.displayToday = true
        this.displayYesterday = false
        this.displayBeforeYesterday = false
        this.AFS_date = `${this.selectedDate.getFullYear()}-${(this.selectedDate.getMonth() + 1).toString().padStart(2, '0')}-${this.selectedDate.getDate().toString().padStart(2, '0')}`;

    }
    yesterday() {
        const today = new Date(); // תאריך היום
        const yesterday = new Date(today);
        yesterday.setDate(today.getDate() - 1);
        this.selectedDate = yesterday;
        this.displayToday = false
        this.displayYesterday = true
        this.displayBeforeYesterday = false
        this.AFS_date = `${yesterday.getFullYear()}-${(yesterday.getMonth() + 1).toString().padStart(2, '0')}-${yesterday.getDate().toString().padStart(2, '0')}`;
    }
    beforeYesterday() {
        const today = new Date(); // תאריך היום
        const yesterday = new Date(today);
        yesterday.setDate(today.getDate() - 2);
        this.selectedDate = yesterday;
        this.displayToday = false
        this.displayYesterday = false
        this.displayBeforeYesterday = true
        this.AFS_date = String(yesterday);
        this.AFS_date = `${yesterday.getFullYear()}-${(yesterday.getMonth() + 1).toString().padStart(2, '0')}-${yesterday.getDate().toString().padStart(2, '0')}`;

    }
    onInputChangeDate(event: Event) {
        const date: string = (event.target as HTMLInputElement).value
        this.AFS_date = date;
        this.displayToday = false
        this.displayYesterday = false
        this.displayBeforeYesterday = false
    }
    //יצוג שעה    
    formatTime(selectedDate: Date | undefined): string {
        if (selectedDate) {
            const hours = selectedDate?.getHours().toString().padStart(2, '0'); // מקבל את השעות וממלא ב-0 במידה ונדרש
            const minutes2 = selectedDate?.getMinutes().toString().padStart(2, '0'); // מקבל את הדקות וממלא ב-0 במידה ונדרש
            return `${hours}:${minutes2}`;
        }
        return ""

    }
    //בחירת זמן דקות
    minutesSelected(m: number) {
        this.time.setMinutes(m);
        this.minutesCC = this.time.getHours() * 60 + this.time.getMinutes();
        this.AFS_activity_time = this.minutesCC;

    }
    //בחירת זמן שעות
    hoursSelected(h: number) {
        this.time.setHours(h);
        this.minutesCC = this.time.getHours() * 60 + this.time.getMinutes();
        this.AFS_activity_time = this.minutesCC;
    }
    //לחיצה על הינפוט של השעות
    onInputChangeTime(event: Event) {
        const timeValue: string = (event.target as HTMLInputElement).value;
        const timeParts: string[] = timeValue.split(':'); // מפרק את הערך של הזמן למערך של שעה ודקה
        const hours: number = parseInt(timeParts[0], 10); // ממיר את מחרוזת השעות למספר שלם
        const minutes: number = parseInt(timeParts[1], 10); // ממיר את מחרוזת הדקות למספר שלם
        this.minutesCC = hours * 60 + minutes;
        this.AFS_activity_time = this.minutesCC;

        this.displayM10 = false; this.displayM20 = false; this.displayM30 = false; this.displayM40 = false; this.displayM50 = false;
        this.displayH1 = false; this.displayH2 = false; this.displayH3 = false; this.displayH4 = false;
    }

    //הוספת חניך חד פעמי
    async addStudentF() {
        this.loading = true

        if (this.validation2()) {
            this.addStudent.St_gender = this.worker.Wo_gender;
            this.addStudent.St_worker_code = this.worker.Wo_code;
            const parentFAdd = new Parentt(1, "", "", "", "");
            const parentMAdd = new Parentt(1, "", "", "", "");;
            const studiesAdd = new StudiesForStudent(1, 1, "", "", "", "", "", "");
            const dataStudentAdd = { data: [this.addStudent, parentFAdd, parentMAdd, [], studiesAdd] }

            //הוספת חניך
            await new Promise<void>((resolve, reject) => {

                this.api.AddStudent(dataStudentAdd).subscribe(
                    (response) => {
                        this.addStudent.St_code = (response as Student).St_code
                        this.generalStudents(2);
                        this.selectStudentBoxAdd(this.addStudent.St_code)
                        this.snackBar.open('!נוסף בהצלחה', '', { duration: 3000 });
                        this.loading = false
                        resolve();

                    },
                    (error) => {
                        this.snackBar.open('שגיאה בהוספת חניך', '', { duration: 3000 });
                        this.loading = false
                        resolve();
                    });
            });
            this.addStudent = new Student(0, "", 1, "", "", "", "", undefined, undefined, 1, "", "", "", "", 1, 1, 1, "", "", "", 1, "", 1, 1, 1, "", "", "");


        }
        else {
            this.snackBar.open('!הפרטים שגויים', '', { duration: 3000 });
        }

    }

    //אחרי השמירה ניקוי
    empty() {

        //this.sec1 = ""
        this.statusF = 1;
        //   this.listSelectedStudents = [];
        //תאריך וטטימר
        this.selectedDate = new Date(); // התאריך הנוכחי כברירת מחדל
        this.minutesCC = 0;
        this.minutes = 0;

        this.time = new Date();;
        this.kilomet = 0
        this.exit = ""
        this.target = ""
        //inputValue = 'משתתף חד פעמי';
        this.displayTimeTimer = 0

        this.displayGroupActivities = false;       //פעילות קבוצתית
        //  this.displayallList = false        //כל החנכים  
        //  this.displaystudentActive = true  //רק פעילים    
        //  this.displaystudentFinish = false     //רק שסיימו
        //  this.displaystudentSuspended = false  //רק מושהים

        this.displayToday = true          //היום
        this.displayYesterday = false      //אתמול
        this.displayBeforeYesterday = false    //שלשום

        this.displayM10 = false
        this.displayM20 = false
        this.displayM30 = false
        this.displayM40 = false
        this.displayM50 = false

        this.displayH1 = false
        this.displayH2 = false
        this.displayH3 = false
        this.displayH4 = false

        this.AFS_date = `${this.selectedDate.getFullYear()}-${(this.selectedDate.getMonth() + 1).toString().padStart(2, '0')}-${this.selectedDate.getDate().toString().padStart(2, '0')}`;
        this.AFS_activity_time = 0
        this.AFS_exit = ""
        this.AFS_target = ""
        this.AFS_kilometer = 0

        this.validAFS_exit = false
        this.validAFS_target = false

        this.time.setHours(0);
        this.time.setMinutes(0);
    }
    validation2() {
        return !this.validNameF && !this.validNane;
    }
    //מעבר לעדכון חניך 
    async updateStudent(student: Student) {
        this.editStudent.emit(student);
    }
}
/*
        //עם חיפוש

    //רשימת תת קטגטרית רכישת מוצר
    generalSubCategoryGift() {
        this.api.getSubCategoryForCategory(5, "xxx").subscribe(Date => {
            this.listSubCategoryGift = []
            this.listSubCategoryGift.push(...Date);
            this.cdRef.detectChanges();
        });
    }
    onInputChangeSearchGift(event: Event) {
        var str: string = (event.target as HTMLInputElement).value
        if (str === "") {
            this.api.getSubCategoryForCategory(5, "xxx").subscribe(Date => {
                this.listSubCategoryGift = []
                this.listSubCategoryGift.push(...Date);
                this.cdRef.detectChanges();
                if (this.listSubCategoryGift.length > 0) {
                    this.displaySubCategoryGift = true
                }
                else
                    this.displaySubCategoryGift = false
            })
        }
        else {
            this.searchGift = str;
            this.api.getSubCategoryForCategory(5, this.searchGift).subscribe(Date => {
                this.listSubCategoryGift = []
                this.listSubCategoryGift.push(...Date);
                this.cdRef.detectChanges();
                if (this.listSubCategoryGift.length > 0) {
                    this.displaySubCategoryGift = true
                }
                else
                    this.displaySubCategoryGift = false
            })
        }


    }
    selectSubCategoryGift(nameSubCategoryGift: string) {
        this.AFS_short_description = nameSubCategoryGift;
        this.searchGift=nameSubCategoryGift;
        this.displaySubCategoryGift=false;
    }*/