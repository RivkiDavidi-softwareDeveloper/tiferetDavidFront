import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
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

@Component({
    selector: 'app-activity-reporting',
    standalone: true,
    templateUrl: './activity-reporting.component.html',
    styleUrls: ['./activity-reporting.component.scss'],
    imports: [CommonModule, StudentComponent, NgSelectModule, PastFrequencyComponent, FileUploadComponent, LoadingSpinnerComponent, TaskComponent]
})

export class ActivityReportingComponent implements OnInit {

    //עריכת חניך מדיווח על פעילות
    @Output() editStudent: EventEmitter<Student> = new EventEmitter()

    //היסטוריית פעילות
    listOfAcitivities: Array<Activity> = [];
    listOfCategoriesForActivity: Array<CategoriesForActivity> = [];
    //הוספת משימה
    displayAddTask = false

    //תת קטגוריות
    listSubCategoryGift: Array<SubcategoryForTypeActivity> = []
    listSubCategoryOut: Array<SubcategoryForTypeActivity> = []
    gift = ""
    out = ""
    school = ""
    displaySubCategoryGift = false
    displaySubCategoryOut = false

    sec4 = ""
    sec5 = ""

    text = 'בחר מרשימה';
    showList: boolean = false;
    timerr: boolean = false;
    //עובד
    @Input() worker: Worker = new Worker(1, "", 1, 1, "", "", "", "", "")

    //רשימת חניכים
    listOfStudents: Array<Student> = [];
    //רשימת חניכים תדירות
    listOfStudents2: Array<Student> = [];

    statusF = 1;
    //החניך שנבחר
    addStudent: Student = new Student(0, "", 1, "", "", "", "", undefined, undefined, 1, "", "", "", "", 1, 1, 1, "", "", "", 1, "", 1, 1, 1, undefined, undefined, [], undefined, []);

    listSelectedStudents: Array<StudentForActivity> = [];
    listTypesForActivity: Array<CategoriesForActivity> = [];
    selectedStudent2: StudentForActivity | undefined
    //תאריך וטטימר
    @Input() selectedDate: Date = new Date(); // התאריך הנוכחי כברירת מחדל
    @Input() minutes = 0;
    @Input() kilomet = 0
    @Input() exit = ""
    @Input() target = ""
    minutesCC = 0;

    time: Date = new Date();

    codeSubCategoryOut = 0;
    codeSubCategoryGift = 0;

    //inputValue = 'משתתף חד פעמי';
    //דגלים להצגת פרטי פעילות
    displayFhoneDetails = false
    displayMeetingDetails = false
    displayTravelDetails = false        //נסיעה
    displayProductPurchaseDetails = false       //רכישת מוצר
    displayForeignActivityDetails = false     //פעילות חוץ
    displaySchoolPlacementDetails = false  //שיבוץ בישיבה
    displayLearningDetails = false
    displayActivityGroupDetails = false

    displayGroupActivities = false;       //פעילות קבוצתית
    displayallList = false        //כל החנכים  
    displaystudentActive = true  //רק פעילים    
    displaystudentFinish = false     //רק שסיימו
    displaystudentSuspended = false  //רק מושהים

    displayToday = true          //היום
    displayYesterday = false      //אתמול
    displayBeforeYesterday = false    //שלשום

    displayFileUpload = false //האם להציג אפשרות להוספת קבצים
    displayM10 = false
    displayM20 = false
    displayM30 = false
    displayM40 = false
    displayM50 = false

    displayH1 = false
    displayH2 = false
    displayH3 = false
    displayH4 = false

    displayNesuChoose1 = false
    displayNesuChoose2 = true
    displayNesuChoose3 = false
    displayNesuChoose4 = false
    displayNesuChoose5 = false

    //הוספת פעילות
    AFS_date = `${this.selectedDate.getFullYear()}-${(this.selectedDate.getMonth() + 1).toString().padStart(2, '0')}-${this.selectedDate.getDate().toString().padStart(2, '0')}`;
    AFS_activity_time = 0
    AFS_with_who = "עם הבחור"
    AFS_short_description = ""
    AFS_description = ""
    AFS_price: number = 0
    AFS_exit = ""
    AFS_target = ""
    AFS_kilometer = 0
    AFS_name_school = ""

    validAFS_with_who = false
    validAFS_description = false
    validAFS_exit = false
    validAFS_target = false
    validAFS_name_school = false

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
    //הוספת משימת המשך
    addTask() {
        this.displayAddTask = true
    }
    closePAdd(display: boolean) {
        this.displayAddTask = display

    }
    async ngOnInit(): Promise<void> {

        this.generalSubCategoryGift()
        this.generalSubCategoryOut();
        await new Promise<void>((resolve, reject) => {
            this.generalStudents(1);
            resolve(); // מסמן שהפעולה הושלמה
        });
        //this.generalStudents2()

    }
    //מעבר לעריכת חניך
    updateStudent() {

        var student = this.listOfStudents.find(s => s.St_code == this.listSelectedStudents[0].SFA_code_student)
        this.editStudent.emit(student);

    }
    //רשימת תת קטגטרית רכישת מוצר
    generalSubCategoryGift() {
        this.api.getSubCategoryForCategory(5).subscribe(Date => {
            this.listSubCategoryGift = []
            this.listSubCategoryGift.push(...Date);
            this.cdRef.detectChanges();
        });
    }
    onInputChangeSearchGift(event: Event) {
        var str: string = (event.target as HTMLInputElement).value.toString()
        this.gift = str

    }
    selectSubCategoryGift(event: Event) {
        var str: string = (event.target as HTMLInputElement).value.toString()
        if (str == "-1") {
            this.displaySubCategoryGift = true
            this.gift = ""
        }
        else {
            this.displaySubCategoryGift = false
            this.gift = ""

            if (str != "0") {
                this.gift = str
            }
        }
    }
    //רשימת תת קטגורית פעילות חוץ
    generalSubCategoryOut() {
        this.api.getSubCategoryForCategory(6).subscribe(Date => {
            this.listSubCategoryOut = []
            this.listSubCategoryOut.push(...Date);
            this.cdRef.detectChanges();
        });
    }
    onInputChangeSearchOut(event: Event) {
        var str: string = (event.target as HTMLInputElement).value.toString()
        this.out = str
    }
    addSubCategory(codeTypeActivity: number, str: string) {
        var subCategory: SubcategoryForTypeActivity = new SubcategoryForTypeActivity(1, codeTypeActivity, str)
        this.api.AddSubCategory(subCategory).subscribe(
            (response) => {
                if (codeTypeActivity == 6) {
                    this.generalSubCategoryOut();
                    this.displaySubCategoryOut = false;
                    this.codeSubCategoryOut = response
                }
                else {
                    this.generalSubCategoryGift();
                    this.displaySubCategoryGift = false;
                    this.codeSubCategoryGift = response
                }

            }
        )
    }
    selectSubCategoryOut(event: Event) {
        var str: string = (event.target as HTMLInputElement).value.toString()
        if (str === "-1") {
            this.out = ""
            this.displaySubCategoryOut = true
        }
        else {
            this.displaySubCategoryOut = false
            this.out = ""
            if (str != "0") {
                this.out = str
            }
        }
    }
    //רשימת הפעילויות
    generalActivities() {
        if (!this.displayGroupActivities) {
            this.api.getActivities(1, this.worker.Wo_gender, this.worker.Wo_code, this.listSelectedStudents[0].SFA_code_student, 0, new Date().getFullYear(), 0).subscribe(Date => {
                this.listOfAcitivities = [];
                this.listOfAcitivities.push(...Date);
                this.cdRef.detectChanges();
            });
        }

    }
    // רשימת קטגוריות לפעילות
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
    //רשימת חניכים
    async generalStudents(ifFrequency: number): Promise<void> {
        await new Promise<void>((resolve, reject) => {
            this.api.getStudents(0, 0, this.statusF, this.worker.Wo_code).subscribe(Date => {
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
                        this.api.getLastActivityForStudent(s.St_code).subscribe(Date => {
                            lastDate = Date;
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

    //שיבוץ בישיבה
    onSchoolNew(event: Event) {
        var code = Number((event.target as HTMLInputElement).value.toString());
        if (code == 1) {
            this.school = "שיבוץ בישיבה חדשה"
        }
        if (code == 2) {
            this.school = "החזרה לישיבה קודמת"
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
            amount = student.St_amount_frequency;
        }
        //בשבועות 
        if (student.St_code_frequency == 2) {
            amount = student.St_amount_frequency * 7;
        }
        //בחודשים
        if (student.St_code_frequency == 3) {
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
            const studentForActivity: StudentForActivity = new StudentForActivity(1, 1, codeStuent)
            this.listSelectedStudents.push(studentForActivity)
            this.cdRef.detectChanges();
        }
        else {
            this.listSelectedStudents = [];
            const studentForActivity: StudentForActivity = new StudentForActivity(1, 1, codeStuent)
            this.listSelectedStudents.push(studentForActivity)
            this.cdRef.detectChanges();
        }
    }
    //בחירת חניך מהתמונות
    selectStudentBoxAdd(codeStuent: number) {
        if (this.displayGroupActivities) {
            const studentForActivity: StudentForActivity = new StudentForActivity(1, 1, codeStuent)
            this.listSelectedStudents.push(studentForActivity)
            this.cdRef.detectChanges();

        }
        else {
            this.listSelectedStudents = [];
            const studentForActivity: StudentForActivity = new StudentForActivity(1, 1, codeStuent)
            this.listSelectedStudents.push(studentForActivity)
            this.cdRef.detectChanges();
            this.generalActivities()
            this.generalCategories()
        }

    }
    selectStudentBoxDelete(codeStuent: number) {
        this.listSelectedStudents.forEach((s, index) => {
            if (s.SFA_code_student === codeStuent) {
                this.listSelectedStudents.splice(index, 1);

            }
        });
        this.generalActivities()
        this.generalCategories()
        this.cdRef.detectChanges();
    }
    convertToStudent(student: StudentForActivity) {
        return this.listOfStudents.find(s => s.St_code == student.SFA_code_student)
    }
    group() {
        if (this.displayGroupActivities) {
            this.displayNesuChoose1 = true
            this.displayNesuChoose2 = false
            this.displayNesuChoose3 = false
            this.displayNesuChoose4 = false
            this.displayNesuChoose5 = false
            this.AFS_with_who = "קבוצתית"
            this.displayActivityGroupDetails = true
            var category: CategoriesForActivity = new CategoriesForActivity(1, 1, 8)
            this.listTypesForActivity.push(category)
        }
        else {
            this.displayNesuChoose1 = false
            this.displayNesuChoose2 = true
            this.displayNesuChoose3 = false
            this.displayNesuChoose4 = false
            this.displayNesuChoose5 = false
            this.AFS_with_who = "עם הבחור"
            this.displayActivityGroupDetails = false
            this.listTypesForActivity.forEach((s, index) => {
                if (s.CFA_code_type_activity === 8) {
                    this.listTypesForActivity.splice(index, 1);
                }
            });
            this.listSelectedStudents = [];
        }
        this.cdRef.detectChanges();
    }

    //בחירת מונה
    onTimerSelected(event: Event) {
        const codeTimer = Number((event.target as HTMLInputElement).value);
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
    //בחירת נשוא
    onInputChangeNesu(event: Event) {
        const nesu: string = (event.target as HTMLInputElement).value;
        if (nesu.length <= 40) {
            this.AFS_with_who = nesu;
            this.validAFS_with_who = false;
        }
        else {
            this.validAFS_with_who = true;
        }

    }
    //בחירת קטגוריות לפעילות
    selectCategory1() {
        if (this.displayLearningDetails) {
            var category: CategoriesForActivity = new CategoriesForActivity(1, 1, 1)
            this.listTypesForActivity.push(category);
        }
        else {
            this.listTypesForActivity.forEach((s, index) => {
                if (s.CFA_code_type_activity === 1) {
                    this.listTypesForActivity.splice(index, 1);
                }
            });
        }
        this.cdRef.detectChanges();
    }
    selectCategory2() {
        if (this.displayFhoneDetails) {
            var category: CategoriesForActivity = new CategoriesForActivity(1, 1, 2)
            this.listTypesForActivity.push(category)
        }
        else {
            this.listTypesForActivity.forEach((s, index) => {
                if (s.CFA_code_type_activity === 2) {
                    this.listTypesForActivity.splice(index, 1);
                }
            });
        }
        this.cdRef.detectChanges();
    }
    selectCategory3() {
        if (this.displayMeetingDetails) {
            var category: CategoriesForActivity = new CategoriesForActivity(1, 1, 3)
            this.listTypesForActivity.push(category)
        }
        else {
            this.listTypesForActivity.forEach((s, index) => {
                if (s.CFA_code_type_activity === 3) {
                    this.listTypesForActivity.splice(index, 1);
                }
            });
        }
        this.cdRef.detectChanges();
    }
    selectCategory4() {
        if (this.displayTravelDetails) {
            var category: CategoriesForActivity = new CategoriesForActivity(1, 1, 4)
            this.listTypesForActivity.push(category)
        }
        else {
            this.listTypesForActivity.forEach((s, index) => {
                if (s.CFA_code_type_activity === 4) {
                    this.listTypesForActivity.splice(index, 1);
                }
            });
        }
        this.cdRef.detectChanges();
    }
    selectCategory5() {
        if (this.displayProductPurchaseDetails) {
            var category: CategoriesForActivity = new CategoriesForActivity(1, 1, 5)
            this.listTypesForActivity.push(category)
        }
        else {
            this.listTypesForActivity.forEach((s, index) => {
                if (s.CFA_code_type_activity === 5) {
                    this.listTypesForActivity.splice(index, 1);
                }
            });
        }
        this.cdRef.detectChanges();
    }
    selectCategory6() {
        if (this.displayForeignActivityDetails) {
            var category: CategoriesForActivity = new CategoriesForActivity(1, 1, 6)
            this.listTypesForActivity.push(category)
        }
        else {
            this.listTypesForActivity.forEach((s, index) => {
                if (s.CFA_code_type_activity === 6) {
                    this.listTypesForActivity.splice(index, 1);
                }
            });
        }
        this.cdRef.detectChanges();
    }
    selectCategory7() {
        if (this.displaySchoolPlacementDetails) {
            var category: CategoriesForActivity = new CategoriesForActivity(1, 1, 7)
            this.listTypesForActivity.push(category)
        }
        else {
            this.listTypesForActivity.forEach((s, index) => {
                if (s.CFA_code_type_activity === 7) {
                    this.listTypesForActivity.splice(index, 1);
                }
            });
        }
        this.cdRef.detectChanges();
    }
    selectCategory8() {
        if (this.displayActivityGroupDetails) {
            var category: CategoriesForActivity = new CategoriesForActivity(1, 1, 8)
            this.listTypesForActivity.push(category)
        }
        else {
            this.listTypesForActivity.forEach((s, index) => {
                if (s.CFA_code_type_activity === 8) {
                    this.listTypesForActivity.splice(index, 1);
                }
            });
        }
        this.cdRef.detectChanges();
    }


    //מילוי מחיר
    onInputChangePrice(event: Event) {
        const price = Number((event.target as HTMLInputElement).value);
        this.AFS_price = price;
    }
    //מילוי מוצא 
    onInputChangeExit(event: Event) {
        const exit: string = (event.target as HTMLInputElement).value;
        if (exit.length <= 100) {
            this.AFS_exit = exit;
            this.validAFS_exit = false;
        }
        else {
            this.validAFS_exit = true;
        }
    }
    //מילוי יעד 
    onInputChangeTarget(event: Event) {
        const target: string = (event.target as HTMLInputElement).value;
        if (target.length <= 100) {
            this.AFS_target = target;
            this.validAFS_target = false;
        }
        else {
            this.validAFS_target = true;
        }
    }
    //מילוי קילומטרים 
    onInputChangeKM(event: Event) {
        const km = Number((event.target as HTMLInputElement).value);
        this.AFS_kilometer = km;
    }
    //מילוי חניך נוסף לנסיעה
    onStudentSelected2(event: Event) {
        const codeStuent = Number((event.target as HTMLInputElement).value);
        this.selectedStudent2 = new StudentForActivity(1, 1, codeStuent)
    }
    //מילוי שם ישיבה 
    onInputChangeNSchool(event: Event) {
        const name: string = (event.target as HTMLInputElement).value;
        if (name.length <= 40) {
            this.AFS_name_school = name;
            this.validAFS_name_school = false;
        }
        else {
            this.validAFS_name_school = true;
        }
    }
    //מילוי תאור פעילות
    onInputChangeDescription(event: Event) {
        const description: string = (event.target as HTMLInputElement).value;
        if (description.length <= 350) {
            this.AFS_description = description;
            this.validAFS_description = false;
        }
        else {
            this.validAFS_description = true;
        }
    }
    //הוספת קבצים לפעילות
    //כל הפעולות שמטפלות בהעלאת קבצים
    selectedFiles: FileList | undefined = undefined;
    totalSize = 0;
    onFileSelected(event: Event) {
        const input = event.target as HTMLInputElement;
        if (input.files) {
            this.selectedFiles = input.files;
        }
        if (this.selectedFiles) {
            // הגודל המקסימלי במגה-בייטים
            const maxTotalSizeMB = 29;
            // הגודל המקסימלי בבייטים
            const maxTotalSizeBytes = maxTotalSizeMB * 1024 * 1024;
            this.totalSize = 0;
            for (let i = 0; i < this.selectedFiles.length; i++) {
                this.totalSize += this.selectedFiles[i].size;
            }
            if (this.totalSize >= maxTotalSizeBytes) {
                this.snackBar.open('גודל הקבצים עולה על הגודל הניתן להעלאה', 'x', { duration: 3000 });
                this.selectedFiles = undefined
            }
        }
    }


    formatFileSize(size: number): string {
        if (size === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
        const i = Math.floor(Math.log(size) / Math.log(k));
        return parseFloat((size / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }
    //ממיר למערך
    f(selectedFiles: FileList) {
        let filesArray: File[] = Array.from(selectedFiles);
        return filesArray;
    }
    // בתוך כיתת ה- FileUploadComponent שלך

    getFileIcon(file: File): string {
        const extension = this.getFileExtension(file.name);
        switch (extension.toLowerCase()) {
            case 'xlsx':
            case 'xls':
                return 'excel-icon-class'; // להחליף במחלקת CSS אמיתית עבור סמלי Excel
            case 'docx':
            case 'doc':
                return 'word-icon-class'; // להחליף במחלקת CSS אמיתית עבור סמלי Word
            case 'pdf':
                return 'pdf-icon-class'; // להחליף במחלקת CSS אמיתית עבור סמלי PDF
            case 'jpg':
            case 'jpeg':
            case 'png':
            case 'gif':
                return 'image-icon-class'; // להחליף במחלקת CSS אמיתית עבור סמלי תמונה
            case 'mp4':
            case 'MP4':
                return 'video-icon-class';
            case 'mp3':
            case 'MP3':
                return 'music-icon-class';
            // להוסיף עוד מקרים לסוגי קבצים שונים בהתאם לצורך
            default:
                return 'default-file-icon-class'; // מחלקת סמל ברירת מחדל לסוגי קבצים שאינם ידועים
        }
    }

    getFileExtension(filename: string): string {
        return filename.split('.').pop()!.toLowerCase();
    }
    //הוספת פעילות
    async addActivity() {
        this.loading = true;
        //בדיקה אם הנתונים מלאים
        if (this.ifNotEmpty()) {
            //בדיקה שהנתונים תקינים
            if (this.validation()) {
                if (this.displayProductPurchaseDetails && this.displayForeignActivityDetails)
                    this.AFS_short_description = this.gift + " , " + this.out
                else {
                    if (this.displayProductPurchaseDetails)
                        this.AFS_short_description = this.gift
                    if (this.displayForeignActivityDetails)
                        this.AFS_short_description = this.out
                    if (this.displaySchoolPlacementDetails) {
                        this.AFS_short_description = this.school;
                    }
                }

                const activityAdd: Activity = new Activity(1, this.worker.Wo_code, this.AFS_date, this.AFS_activity_time,
                    this.AFS_with_who, this.AFS_short_description, this.AFS_description, this.AFS_price, this.AFS_exit, this.AFS_target, this.AFS_kilometer, this.AFS_name_school, this.listSelectedStudents, this.listTypesForActivity)
                await new Promise<void>((resolve, reject) => {
                    this.api.addActivity(activityAdd, this.selectedFiles).subscribe((response) => {
                        console.log('Activity added successfully', response);
                        this.snackBar.open('הפעילות נשמרה בהצלחה', 'x', { duration: 3000 });
                        this.loading = false;
                        resolve();
                    }, (error) => {
                        console.error('Error adding activity', error);
                        this.snackBar.open('שמירת הפעילות נכשלה', 'x', { duration: 3000 });
                        this.loading = false;
                        resolve();
                    });
                });
                this.empty();
                this.generalStudents(2);
            }
            else {
                this.snackBar.open('פרטים אינם תקינים', 'x', { duration: 2000 });
            }
        }
        else {
            this.snackBar.open('אופס! חסר פרטים...', 'x', { duration: 2000 });

        }
    }


    //הוספת חניך חד פעמי
    async addStudentF() {
        this.loading = true

        if (this.validation2()) {
            this.addStudent.St_gender = this.worker.Wo_gender;
            this.addStudent.St_worker_code = this.worker.Wo_code;
            //הוספת חניך
            await new Promise<void>((resolve, reject) => {

                this.api.AddStudent(this.addStudent).subscribe(
                    (response) => {
                        this.addStudent.St_code = response
                        this.loading = false
                        this.generalStudents(2);
                        this.selectStudentBoxAdd(this.addStudent.St_code)
                        this.snackBar.open('!נוסף בהצלחה', '', { duration: 3000 });
                        resolve();

                    },
                    (error) => {
                        this.loading = false
                        resolve();


                    });
            });
            this.addStudent = new Student(0, "", 1, "", "", "", "", undefined, undefined, 1, "", "", "", "", 1, 1, 1, "", "", "", 1, "", 1, 1, 1, undefined, undefined, [], undefined, []);


        }
        else {
            this.snackBar.open('!הפרטים שגויים', '', { duration: 3000 });
        }

    }

    //אחרי השמירה ניקוי
    empty() {

        //this.sec1 = ""
        this.statusF = 1;
        this.listSelectedStudents = [];
        this.listTypesForActivity = [];
        this.selectedStudent2 = undefined
        //תאריך וטטימר
        this.selectedDate = new Date(); // התאריך הנוכחי כברירת מחדל
        this.minutesCC = 0;
        this.minutes = 0;

        this.time = new Date();;
        //inputValue = 'משתתף חד פעמי';
        //דגלים להצגת פרטי פעילות
        this.displayFhoneDetails = false
        this.displayMeetingDetails = false
        this.displayTravelDetails = false        //נסיעה
        this.displayProductPurchaseDetails = false       //רכישת מוצר
        this.displayForeignActivityDetails = false     //פעילות חוץ
        this.displaySchoolPlacementDetails = false  //שיבוץ בישיבה
        this.displayLearningDetails = false
        this.displayActivityGroupDetails = false

        this.displayGroupActivities = false;       //פעילות קבוצתית
        this.displayallList = false        //כל החנכים  
        this.displaystudentActive = true  //רק פעילים    
        this.displaystudentFinish = false     //רק שסיימו
        this.displaystudentSuspended = false  //רק מושהים

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

        this.displayNesuChoose1 = false
        this.displayNesuChoose2 = true
        this.displayNesuChoose3 = false
        this.displayNesuChoose4 = false
        this.displayNesuChoose5 = false

        this.AFS_date = `${this.selectedDate.getFullYear()}-${(this.selectedDate.getMonth() + 1).toString().padStart(2, '0')}-${this.selectedDate.getDate().toString().padStart(2, '0')}`;
        this.AFS_activity_time = 0
        this.AFS_with_who = "עם הבחור"
        this.AFS_short_description = ""
        this.AFS_description = ""
        this.AFS_price = 0
        this.AFS_exit = ""
        this.AFS_target = ""
        this.AFS_kilometer = 0
        this.AFS_name_school = ""

        this.validAFS_with_who = false
        this.validAFS_description = false
        this.validAFS_exit = false
        this.validAFS_target = false
        this.validAFS_name_school = false

        this.time.setHours(0);
        this.time.setMinutes(0);
        //תיאור פעילות
        this.AFS_description = ""
        //ריקון רשימת הקבצים להעלאה
        this.selectedFiles = undefined
    }
    validation() {
        return !this.validAFS_with_who && !this.validAFS_description && !this.validAFS_exit &&
            !this.validAFS_target && !this.validAFS_name_school;
    }
    validation2() {
        return !this.validNameF && !this.validNane;
    }
    ifNotEmpty() {
        if (this.displayLearningDetails)
            return this.AFS_activity_time != 0 && this.listTypesForActivity.length > 0 && this.listSelectedStudents.length > 0
        return this.AFS_activity_time != 0 && this.listTypesForActivity.length > 0 && this.listSelectedStudents.length > 0 && this.AFS_description.length >= 10;

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