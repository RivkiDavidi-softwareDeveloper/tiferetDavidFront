import { ChangeDetectorRef, Component, OnDestroy, OnInit, EventEmitter, Input, Output, input } from '@angular/core';
import { io, Socket } from 'socket.io-client';

import { CommonModule, Time } from '@angular/common';
import { StudentComponent } from "../student/student.component";
import { Student } from '../../models/student.class';
import { Worker } from '../../models/worker.class';
import { ApiService } from '../../services/api.service';
import { Activity } from '../../models/activity.class';
import { StudentForActivity } from '../../models/studentForActivity.class';
import { CategoriesForActivity } from '../../models/categoriesForActivity.class';
import { NgSelectModule } from '@ng-select/ng-select';
import { MatSnackBar } from '@angular/material/snack-bar';
import { PastFrequencyComponent } from "../past-frequency/past-frequency.component";
import { SubcategoryForTypeActivity } from '../../models/subcategoryForTypeActivity.class';
import { TypeOfActivity } from '../../models/TypeOfActivity.enum';
import { FileUploadComponent } from "../file-upload/file-upload.component";
import { LoadingSpinnerComponent } from "../loading-spinner/loading-spinner.component";
import { TaskComponent } from "../task/task.component";
import { response } from 'express';

@Component({
  selector: 'app-update-activity',
  standalone: true,
  imports: [CommonModule, StudentComponent, NgSelectModule, PastFrequencyComponent, FileUploadComponent, LoadingSpinnerComponent, TaskComponent],
  templateUrl: './update-activity.component.html',
  styleUrl: './update-activity.component.scss'
})
export class UpdateActivityComponent implements OnInit, OnDestroy {
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
  @Input() popupDisplayIn = false
  @Output() popupDisplayOut: EventEmitter<boolean> = new EventEmitter()
  //עדכון
  @Input() updateActivity: Activity = new Activity(-1, 1, "", 1, "", "", "", 1, "", "", 1, "", [], [])

  //תת קטגוריות
  listSubCategoryGift: Array<SubcategoryForTypeActivity> = []
  listSubCategoryOut: Array<SubcategoryForTypeActivity> = []
  @Input()  gift = ""
  @Input() out = ""
  @Input() school = ""
  displaySubCategoryGift = false
  displaySubCategoryOut = false
  text = 'בחר מרשימה';
  showList: boolean = false;
  timerr: boolean = false;
  //עובד
  @Input() worker: Worker = new Worker(1, "", 1, 1, "", "", "", "", "", 1)

/*   //רשימת חניכים
  listOfStudents: Array<Student> = [];
  //רשימת חניכים תדירות
  listOfStudents2: Array<Student> = []; */

  statusF = 1;

  //תאריך וטטימר
  @Input() selectedDate: Date = new Date(); // התאריך הנוכחי כברירת מחדל
  /*   @Input() minutes = 0;
    @Input() kilomet = 0
    @Input() exit = ""
    @Input() target = ""
     */
  minutesCC = 0;

  /*   @Input() time: Date = new Date();
   */
  codeSubCategoryOut = 0;
  codeSubCategoryGift = 0;

  //inputValue = 'משתתף חד פעמי';

  @Input() displayGroupActivities = false;       //פעילות קבוצתית
  displayallList = false        //כל החנכים  
  displaystudentActive = true  //רק פעילים    
  displaystudentFinish = false     //רק שסיימו
  displaystudentSuspended = false  //רק מושהים

  @Input() displayToday = false          //היום
  @Input() displayYesterday = false      //אתמול
  @Input() displayBeforeYesterday = false    //שלשום

  displayFileUpload = false //האם להציג אפשרות להוספת קבצים

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
    /*     this.time.setHours(0);
        this.time.setMinutes(0); */
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
    /* this.api.DeleteActi().subscribe(
              (response) => {
                this.snackBar.open('!הפעילויות נמחק בהצלחה', 'x', { duration: 3000 });
              },
              (error) => {
                this.snackBar.open('תהליך המחיקה נכשל', 'x', { duration: 3000 });
    
              }
            ) */
    this.generalSubCategoryGift()
    this.generalSubCategoryOut();
/*     await new Promise<void>((resolve, reject) => {
      this.generalStudents(1);
      resolve(); // מסמן שהפעולה הושלמה
    }); */
    this.connectSocket()
    //this.generalStudents2()
    // קוד לביצוע מחיקה

  }
  //רשימת תת קטגורית רכישת מוצר
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
          this.codeSubCategoryOut = (response as SubcategoryForTypeActivity).SFTA_code
        }
        else {
          this.generalSubCategoryGift();
          this.displaySubCategoryGift = false;
          this.codeSubCategoryGift = (response as SubcategoryForTypeActivity).SFTA_code

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
/*   //רשימת חניכים
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
 */
  //שיבוץ בישיבה
  onSchoolNew(event: Event) {
    var code = Number((event.target as HTMLInputElement).value.toString());
    if (code == 1) {
      this.school = "סידור בישיבה חדשה"
    }
    if (code == 2) {
      this.school = "החזרה לישיבה קודמת"
    }
  }
    onSchoolNew2(event: Event) {
    var code = Number((event.target as HTMLInputElement).value.toString());
    if (code == 1) {
      this.school = 'סידור בתיכון / סמינר חדש'
    }
    if (code == 2) {
      this.school = 'החזרה לתיכון / סמינר קודם'
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

  //בחירת תאריך
  today() {
    this.selectedDate = new Date();
    this.displayToday = true
    this.displayYesterday = false
    this.displayBeforeYesterday = false
    this.updateActivity.AFS_date = `${this.selectedDate.getFullYear()}-${(this.selectedDate.getMonth() + 1).toString().padStart(2, '0')}-${this.selectedDate.getDate().toString().padStart(2, '0')}`;

  }
  yesterday() {
    const today = new Date(); // תאריך היום
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);
    this.selectedDate = yesterday;
    this.displayToday = false
    this.displayYesterday = true
    this.displayBeforeYesterday = false
    this.updateActivity.AFS_date = `${yesterday.getFullYear()}-${(yesterday.getMonth() + 1).toString().padStart(2, '0')}-${yesterday.getDate().toString().padStart(2, '0')}`;
  }
  beforeYesterday() {
    const today = new Date(); // תאריך היום
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 2);
    this.selectedDate = yesterday;
    this.displayToday = false
    this.displayYesterday = false
    this.displayBeforeYesterday = true
    this.updateActivity.AFS_date = String(yesterday);
    this.updateActivity.AFS_date = `${yesterday.getFullYear()}-${(yesterday.getMonth() + 1).toString().padStart(2, '0')}-${yesterday.getDate().toString().padStart(2, '0')}`;

  }
  onInputChangeDate(event: Event) {
    const date: string = (event.target as HTMLInputElement).value
    this.updateActivity.AFS_date = date;
    this.displayToday = false
    this.displayYesterday = false
    this.displayBeforeYesterday = false
  }

  //יצוג שעה    
  formatTime(): string {
    if (this.selectedDate) {
      const hours = this.selectedDate.getHours().toString().padStart(2, '0'); // מקבל את השעות וממלא ב-0 במידה ונדרש
      const minutes2 = this.selectedDate.getMinutes().toString().padStart(2, '0'); // מקבל את הדקות וממלא ב-0 במידה ונדרש
      return `${hours}:${minutes2}`;
    }
    return ""
  }
  //בחירת זמן דקות
  minutesSelected(m: number) {
    this.selectedDate.setMinutes(m);
    this.minutesCC = this.selectedDate.getHours() * 60 + this.selectedDate.getMinutes();
    this.updateActivity.AFS_activity_time = this.minutesCC;

  }
  //בחירת זמן שעות
  hoursSelected(h: number) {
    this.selectedDate.setHours(h);
    this.minutesCC = this.selectedDate.getHours() * 60 + this.selectedDate.getMinutes();
    this.updateActivity.AFS_activity_time = this.minutesCC;
  }

  //לחיצה על הינפוט של השעות
  onInputChangeTime(event: Event) {
    const timeValue: string = (event.target as HTMLInputElement).value;
    const timeParts: string[] = timeValue.split(':'); // מפרק את הערך של הזמן למערך של שעה ודקה
    const hours: number = parseInt(timeParts[0], 10); // ממיר את מחרוזת השעות למספר שלם
    const minutes: number = parseInt(timeParts[1], 10); // ממיר את מחרוזת הדקות למספר שלם
    this.minutesCC = hours * 60 + minutes;
    this.updateActivity.AFS_activity_time = this.minutesCC;
    this.selectedDate.setHours(hours);
    this.selectedDate.setMinutes(minutes);

  }

  //בחירת נשוא
  onInputChangeNesu(event: Event) {
    const nesu: string = (event.target as HTMLInputElement).value;
    if (nesu.length <= 40) {
      this.updateActivity.AFS_with_who = nesu;
      this.validAFS_with_who = false;
    }
    else {
      this.validAFS_with_who = true;
    }

  }
  ifExist(num: number) {
    let d = false
    this.updateActivity.CategoriesForActivities.forEach(element => {
      if (element.CFA_code_type_activity == num)
        d = true
    });
    return d;
  }
  //בחירת קטגוריות לפעילות
  selectCategory(num: number) {
    if (!this.ifExist(num)) {
      var category: CategoriesForActivity = new CategoriesForActivity(1, 1, num)
      this.updateActivity.CategoriesForActivities.push(category)
    }
    else {
      this.updateActivity.CategoriesForActivities.forEach((s, index) => {
        if (s.CFA_code_type_activity === num) {
          this.updateActivity.CategoriesForActivities.splice(index, 1);

        }
      });
    }
    this.cdRef.detectChanges();
  }
  //מילוי מחיר
  onInputChangePrice(event: Event) {
    const price = Number((event.target as HTMLInputElement).value);
    this.updateActivity.AFS_price = price;
  }
  //מילוי מוצא 
  onInputChangeExit(event: Event) {
    const exit: string = (event.target as HTMLInputElement).value;
    if (exit.length <= 100) {
      this.updateActivity.AFS_exit = exit;
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
      this.updateActivity.AFS_target = target;
      this.validAFS_target = false;
    }
    else {
      this.validAFS_target = true;
    }
  }
  //מילוי קילומטרים 
  onInputChangeKM(event: Event) {
    const km = Number((event.target as HTMLInputElement).value);
    this.updateActivity.AFS_kilometer = km;
  }
  //מילוי שם ישיבה 
  onInputChangeNSchool(event: Event) {
    const name: string = (event.target as HTMLInputElement).value;
    if (name.length <= 40) {
      this.updateActivity.AFS_name_school = name;
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
      this.updateActivity.AFS_description = description;
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
  async updateActivityy() {
    this.loading = true;
    //בדיקה אם הנתונים מלאים
    if (this.ifNotEmpty()) {
      //בדיקה שהנתונים תקינים
      if (this.validation()) {
        if (this.ifExist(5) && this.ifExist(6))
          this.updateActivity.AFS_short_description = this.gift + " , " + this.out
        else {
          if (this.ifExist(5))
            this.updateActivity.AFS_short_description = this.gift
          if (this.ifExist(6))
            this.updateActivity.AFS_short_description = this.out
          if (this.ifExist(7)) {
            this.updateActivity.AFS_short_description = this.school;
          }
        }
        await new Promise<void>((resolve, reject) => {
          this.api.updateActivity(this.updateActivity).subscribe((response) => {
            this.snackBar.open('הפעילות עודכנה בהצלחה', 'x', { duration: 3000 });
            this.loading = false;
            resolve();
          }, (error) => {
            this.snackBar.open('עדכון הפעילות נכשל', 'x', { duration: 3000 });
            this.loading = false;
            resolve();
          });
        });
        this.empty();
       this. close()
      }
      else {
        this.snackBar.open('פרטים אינם תקינים', 'x', { duration: 2000 });
      }
    }
    else {
      this.snackBar.open('אופס! חסר פרטים...', 'x', { duration: 2000 });


    }
  }

  //אחרי השמירה ניקוי
  empty() {

    //this.sec1 = ""
    this.statusF = 1;
    //תאריך וטטימר
    this.selectedDate = new Date(); // התאריך הנוכחי כברירת מחדל
    this.minutesCC = 0;

    this.displayGroupActivities = false;       //פעילות קבוצתית
    this.displayallList = false        //כל החנכים  
    this.displaystudentActive = true  //רק פעילים    
    this.displaystudentFinish = false     //רק שסיימו
    this.displaystudentSuspended = false  //רק מושהים

    this.displayToday = false          //היום
    this.displayYesterday = false      //אתמול
    this.displayBeforeYesterday = false    //שלשום

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

    /*     this.time.setHours(0);
        this.time.setMinutes(0); */
    this.selectedDate.setHours(0);
    this.selectedDate.setMinutes(0);
    //תיאור פעילות
    this.AFS_description = ""
    //ריקון רשימת הקבצים להעלאה
    this.selectedFiles = undefined



  //עדכון
  this.updateActivity = new Activity(-1, 1, "", 1, "", "", "", 1, "", "", 1, "", [], [])
  //תת קטגוריות
  this.gift = ""
  this.out = ""
  this.school = ""
  this.displaySubCategoryGift = false
  this.displaySubCategoryOut = false
 this. text = 'בחר מרשימה';
 this. showList = false;

/*   //רשימת חניכים
  listOfStudents: Array<Student> = [];
  //רשימת חניכים תדירות
  listOfStudents2: Array<Student> = []; */
  this.codeSubCategoryOut = 0;
  this.codeSubCategoryGift = 0;
 this. displayFileUpload = false //האם להציג אפשרות להוספת קבצים
 this. isSelect = false;
 this. textInput = '';
 this. selectedOption = 1;
  //פופפ חניכים בתדירות מוגזמת:)
 this. displayPopap = false;
  //סטטוס האנימציה
  this.loading = false;
  }
  validation() {
    return !this.validAFS_with_who && !this.validAFS_description && !this.validAFS_exit &&
      !this.validAFS_target && !this.validAFS_name_school;
  }
  validation2() {
    return !this.validNameF && !this.validNane;
  }
  ifNotEmpty() {
    if (this.ifExist(1))
      return this.updateActivity.AFS_activity_time != 0 && this.updateActivity.CategoriesForActivities.length > 0 && this.updateActivity.StudentForActivities.length > 0
    return this.updateActivity.AFS_activity_time != 0 && this.updateActivity.CategoriesForActivities.length > 0 && this.updateActivity.StudentForActivities.length > 0 && this.updateActivity.AFS_description.length >= 10;

  }
  //סגירת הפופפ
  public close(): void {
    this.empty()
    this.popupDisplayOut.emit(false)
  }
}
