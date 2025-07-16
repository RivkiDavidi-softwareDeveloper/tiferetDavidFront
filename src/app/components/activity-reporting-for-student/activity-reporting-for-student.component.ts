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
@Component({
  selector: 'app-activity-reporting-for-student',
  standalone: true,
  imports: [CommonModule, NgSelectModule, FileUploadComponent, LoadingSpinnerComponent, TaskComponent]
  , templateUrl: './activity-reporting-for-student.component.html',
  styleUrl: './activity-reporting-for-student.component.scss'
})
export class ActivityReportingForStudentComponent {
  @Input() studentSelected: Student | undefined = new Student(0, "", 1, "", "", "", "", undefined, undefined, 1, "", "", "", "", 1, 1, 1, "", "", "", 1, "", 1, 1, 1, "", "", "");
  @Input() displayGroup = true;
  @Input() amountGroup = 1
  @Input() ifTimer = false
  //סטטוס האנימציה
  loading = false;

  //הוספת משימה
  displayAddTask = false
  //הוספת פעילות
  @Input() selectedDate: Date = new Date(); // התאריך הנוכחי כברירת מחדל
  @Input() AFS_date = `${this.selectedDate.getFullYear()}-${(this.selectedDate.getMonth() + 1).toString().padStart(2, '0')}-${this.selectedDate.getDate().toString().padStart(2, '0')}`;
  @Input() AFS_activity_time = 0
  AFS_with_who = "עם הבחור"
  AFS_short_description = ""
  AFS_description = ""
  AFS_price: number = 0
  @Input() AFS_exit = ""
  @Input() AFS_target = ""
  @Input() AFS_kilometer = 0
  AFS_name_school = ""

  validAFS_with_who = false
  validAFS_description = false
  validAFS_exit = false
  validAFS_target = false
  validAFS_name_school = false
  displayNesuChoose2 = true
  displayNesuChoose3 = false
  displayNesuChoose4 = false
  displayNesuChoose5 = false

  //דגלים להצגת פרטי פעילות
  displayFhoneDetails = false
  displayMeetingDetails = false
  displayTravelDetails = false        //נסיעה
  displayProductPurchaseDetails = false       //רכישת מוצר
  displayForeignActivityDetails = false     //פעילות חוץ
  displaySchoolPlacementDetails = false  //שיבוץ בישיבה
  displayLearningDetails = false
  //רשימת קטגוריות לפעילות
  listTypesForActivity: Array<CategoriesForActivity> = [];
  //חניך נוסף לנסיעה
  selectedStudent2: StudentForActivity | undefined
  //תת קטגוריות
  listSubCategoryGift: Array<SubcategoryForTypeActivity> = []
  listSubCategoryOut: Array<SubcategoryForTypeActivity> = []
  gift = ""
  out = ""
  school = ""
  displaySubCategoryGift = false
  displaySubCategoryOut = false
  codeSubCategoryOut = 0;
  codeSubCategoryGift = 0;
  //עובד
  @Input() worker: Worker = new Worker(1, "", 1, 1, "", "", "", "", "", 1)
  constructor(private api: ApiService, private cdRef: ChangeDetectorRef, private snackBar: MatSnackBar) {
  }
  async ngOnInit(): Promise<void> {

    this.generalSubCategoryGift()
    this.generalSubCategoryOut();
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
  selectCategory(num: number, display: boolean) {
    if (display) {
      var category: CategoriesForActivity = new CategoriesForActivity(0, 0, num)
      this.listTypesForActivity.push(category)
    }
    else {
      this.listTypesForActivity.forEach((s, index) => {
        if (s.CFA_code_type_activity === num) {
          this.listTypesForActivity.splice(index, 1);
        }
      });
    }
    this.cdRef.detectChanges();
  }
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
  //עריכת חניך מדיווח על פעילות
  @Output() editStudent: EventEmitter<Student> = new EventEmitter()
  //מעבר לעריכת חניך
  updateStudent() {
    this.editStudent.emit(this.studentSelected);
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
    this.selectedStudent2 = new StudentForActivity(1, 1, codeStuent, undefined)
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
  validation() {
    return !this.validAFS_with_who && !this.validAFS_description && !this.validAFS_exit &&
      !this.validAFS_target && !this.validAFS_name_school;
  }

  ifNotEmpty() {
    if (this.displayLearningDetails)
      return this.AFS_activity_time != 0 && this.listTypesForActivity.length > 0 && this.studentSelected != undefined
    return this.AFS_activity_time != 0 && this.listTypesForActivity.length > 0 && this.studentSelected != undefined && this.AFS_description.length >= 10;
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

        let listSelectedStudents: Array<StudentForActivity> = []
        if (this.studentSelected) {
          let studentForActivity = new StudentForActivity(0, 0, this.studentSelected.St_code, undefined)
          listSelectedStudents.push(studentForActivity)
        }
        if (this.ifTimer) {
          this.AFS_kilometer = this.AFS_kilometer / this.amountGroup
        }
        const activityAdd: Activity = new Activity(1, this.worker.Wo_code, this.AFS_date, (this.AFS_activity_time / this.amountGroup),
          this.AFS_with_who, this.AFS_short_description, this.AFS_description, this.AFS_price, this.AFS_exit,
          this.AFS_target, this.AFS_kilometer, this.AFS_name_school, listSelectedStudents, this.listTypesForActivity)
        await new Promise<void>((resolve, reject) => {
          this.api.addActivity(activityAdd).subscribe((response) => {
            this.snackBar.open('הפעילות נשמרה בהצלחה', 'x', { duration: 3000 });
            this.loading = false;
            resolve();
          }, (error) => {
            this.snackBar.open('שמירת הפעילות נכשלה', 'x', { duration: 3000 });
            this.loading = false;
            resolve();
          });
        });
        this.empty();
        //    this.generalStudents(2);
      }
      else {
        this.snackBar.open('פרטים אינם תקינים', 'x', { duration: 2000 });
      }
    }
    else {
      this.snackBar.open('אופס! חסר פרטים...', 'x', { duration: 2000 });

    }
  }
  empty() {


    this.listTypesForActivity = [];
    this.selectedStudent2 = undefined
    //תאריך וטטימר
    this.selectedDate = new Date(); // התאריך הנוכחי כברירת מחדל


    //inputValue = 'משתתף חד פעמי';
    //דגלים להצגת פרטי פעילות
    this.displayFhoneDetails = false
    this.displayMeetingDetails = false
    this.displayTravelDetails = false        //נסיעה
    this.displayProductPurchaseDetails = false       //רכישת מוצר
    this.displayForeignActivityDetails = false     //פעילות חוץ
    this.displaySchoolPlacementDetails = false  //שיבוץ בישיבה
    this.displayLearningDetails = false

    //  this.displayGroup = false;       //פעילות קבוצתית

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

    /*     this.time.setHours(0);
        this.time.setMinutes(0); */
    //תיאור פעילות
    this.AFS_description = ""
    //ריקון רשימת הקבצים להעלאה
    this.selectedFiles = undefined
  }
  //הוספת משימת המשך
  addTask() {
    this.displayAddTask = true
  }
  closePAdd(display: boolean) {
    this.displayAddTask = display

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
}
