import { ChangeDetectorRef, Component, Input, OnDestroy, OnInit } from '@angular/core';
import { io, Socket } from 'socket.io-client';


import { CommonModule } from '@angular/common';
import { ApiService } from '../../services/api.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Activity } from '../../models/activity.class';
import { Worker } from '../../models/worker.class';
import { StudentForActivity } from '../../models/studentForActivity.class';
import { Student } from '../../models/student.class';
import { CategoriesForActivity } from '../../models/categoriesForActivity.class';
import { TypeOfActivity } from '../../models/TypeOfActivity.enum';
import { UpdateActivityComponent } from "../update-activity/update-activity.component";

@Component({
  selector: 'app-reports',
  standalone: true,
  imports: [CommonModule, UpdateActivityComponent],
  templateUrl: './reports.component.html',
  styleUrl: './reports.component.scss'
})


export class ReportsComponent implements OnInit, OnDestroy {
  //מכנית פעילים
  @Input() status = "system"
  @Input() worker = new Worker(-1, "", 1, 1, "", "", "", "", "", 1)
  //עדכון
  sUpdateActivity = false;
  @Input() updateActivity: Activity = new Activity(-1, 1, "", 1, "", "", "", 1, "", "", 1, "", [], [])
  displayGroupActivities = false;
  @Input() selectedDate: Date = new Date();
  displayToday = false          //היום
  displayYesterday = false      //אתמול
  displayBeforeYesterday = false    //שלשום
  gift = ""
  out = ""
  school = ""

  listOfAcitivities: Array<Activity> = [];
  listOfWorkers: Array<Worker> = [];
  listOfStudentsForActivity: Array<StudentForActivity> = [];
  listOfStudent: Array<Student> = [];
  listOfCategoriesForActivity: Array<CategoriesForActivity> = [];
  monthes: Array<string> = ['ינואר', 'פברואר', 'מרץ', 'אפריל', 'מאי', 'יוני', 'יולי', 'אוגוסט', 'ספטמבר', 'אוקטובר', 'נובמבר', 'דצמבר']
  order = 1
  genderF = 0
  @Input() workerF = -1
  @Input() workerStatusF = 1
  @Input() studentF = -1
  monthF = 0
  yearF = 0
  categoryF = 0
  searchTextWorker: string = ""
  searchTextStudent: string = ""

  amounts: Array<number> = [0, 0, 0, 0]
  //סינון לפי שנים
  years: number[] = [];
  constructor(private api: ApiService, private cdRef: ChangeDetectorRef, private snackBar: MatSnackBar) { }
  ngOnInit(): void {
    this.years = this.generateYears(); // הגדרת השנים בעת יצירת הקומפוננטה
    this.yearF = new Date().getFullYear()
    this.monthF = new Date().getMonth() + 1;
    this.generalActivities();
    this.generalWorkers();
    this.generalStudent();
    this.generalCategories();

    this.connectSocket();

  }
  //סינכרון נתונים בין לקוחות
  socket: Socket | undefined;
  ngOnDestroy(): void {
    if (this.socket)
      this.socket.disconnect();
  }
  connectSocket(): void {
    /*   this.socket = io(this.api.urlBasisSocket, {
        transports: ["websocket"]
      });    this.socket.on("activities-updated", () => {
        this.generalActivities();
        this.generalCategories();
  
      }); */
  }

  //רשימת הפעילויות
  generalActivities() {
    this.api.FindActivities(this.searchTextWorker, this.searchTextStudent, this.order, this.genderF, this.workerF, this.workerStatusF, this.studentF, this.monthF, this.yearF, this.categoryF).subscribe(Date => {
      this.listOfAcitivities = [];
      this.listOfAcitivities.push(...Date);
      this.cdRef.detectChanges();
      this.amountW()

    });
  }
  //רשימה של פעילים
  generalWorkers() {
    this.api.FindWorker("", 0, this.genderF, this.workerStatusF, 0, 0).subscribe(Date => {

      this.listOfWorkers = [];
      this.listOfWorkers.push(...Date);
      this.cdRef.detectChanges();
    });

  }
  //רשימת חניכים
  generalStudent() {
    this.api.FindStudent("", 0, this.genderF, 0, this.workerF).subscribe(Date => {
      this.listOfStudent = [];
      this.listOfStudent.push(...Date);
      this.cdRef.detectChanges();

    });

  }
  // רשימת קטגוריות לפעילות
  generalCategories() {
    this.api.getCategories().subscribe(Date => {
      this.listOfCategoriesForActivity = [];
      this.listOfCategoriesForActivity.push(...Date);
      this.cdRef.detectChanges();

    });

  }
  //שם עובד
  nameWorker(codeWorker: number) {
    if (codeWorker == -1) {
      return "---"
    }
    var name = "";
    this.listOfWorkers.forEach(w => {
      if (w.Wo_code == codeWorker) {
        name = w.Wo_Fname + " " + w.Wo_name;
      }
    });
    return name;
  }
  // שם עובד ללא כפילויות
  nameWorker2(i: number, y: number) {
    var str2 = this.nameWorker(this.listOfAcitivities[y].AFS_worker_code)
    if (i == -1) {
      return str2
    }
    var str1 = this.nameWorker(this.listOfAcitivities[i].AFS_worker_code)
    if (str1 === str2) {
      return ""
    }
    return str2;
  }

  //שם תלמיד ללא כפילות

  nameStudent2(codeStudent: number, codeActivity: number, activity: Activity, i: number, y: number) {
    var str2 = this.nameStudent(codeStudent);
    //לבדוק אם יש רשימה להחזיר את השם כמו שהוא
    if (activity.StudentForActivities.length > 1) {
      return str2;
    }
    //לבדוק אם זה הפעילות הראשונה שמוצגת
    if (i == -1) {
      return str2
    }
    //לבדוק אם השם הנוכחי שווה לשם הראשון בפעילות הקודמת אם כן להחזיר מחרוזת ריקה 
    //שם הראשון בפעילות הקודמת
    var str1 = this.nameStudent(this.listOfAcitivities[i].StudentForActivities[0].SFA_code_student);
    if (str1 === str2) {
      return ""
    }
    return str2;
  }
  //שם תלמיד

  nameStudent(codeStudent: number) {
    if (codeStudent == -1) {
      return "---"
    }
    var name = "";
    this.listOfStudent.forEach(s => {
      if (s.St_code == codeStudent) {
        name = s.St_Fname + " " + s.St_name;
      }
    });
    return name;
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
  ifDisplay(codeActivity: number, code: number) {
    var listOfCategories: Array<CategoriesForActivity> = this.namesCategories(codeActivity)
    var d = false
    listOfCategories.forEach(c => {
      if (c.CFA_code_type_activity == code) {
        d = true;
      }
    });
    return d;
  }
  //שם מגדר
  nameGender(codeGender: number) {
    if (codeGender == 0) {
      return "---"
    }
    if (codeGender == 1) {
      return "בנים"
    }
    else {
      return "בנות"
    }
  }
  //שם חודש
  nameMonth(code: number) {
    if (code == 0) {
      return '---'
    }
    else
      return this.monthes[code - 1];
  }
  //שם מיון
  nameOrder(codeOrder: number) {
    if (codeOrder == 0) {
      return "פעיל"
    }
    if (codeOrder == 1) {
      return "תאריך"
    }
    return "חניך"
  }
  //מחזירה יום לפי תאריך
  getDayFromDate(dateString: string): string {
    const parts = dateString.split('-'); // פיצול התאריך לתתי חלקים על פי המחלקים ביניהם קווים מפרידים
    const year = parseInt(parts[0], 10); // המרת החלק הראשון למספר שלם
    const month = parseInt(parts[1], 10); // המרת החלק השני למספר שלם
    const day = parseInt(parts[2], 10); // המרת החלק השלישי למספר שלם
    const date = new Date(year, month - 1, day); // יצירת אובייקט תאריך מהערכים המקובלים
    const dayOfWeek = date.getDay(); // השגת היום בשבוע מתוך התאריך
    switch (dayOfWeek) {
      case 0:
        return "יום ראשון "; break;
      case 1:
        return "יום שני   "; break;
      case 2:
        return 'יום שלישי '; break;
      case 3:
        return 'יום רביעי '; break;
      case 4:
        return 'יום חמישי '; break;
      case 5:
        return 'יום שישי  '; break;
      case 6:
        return 'יום שבת  '; break;
      default:
        return ''
    }
  }
  // מחזירה יום ללא כפילויות
  getDayFromDate2(i: number, y: number) {
    var str2 = this.listOfAcitivities[y].AFS_date
    if (i == -1) {
      return this.getDayFromDate(str2)
    }
    var str1 = this.listOfAcitivities[i].AFS_date
    if (str1 === str2) {
      return ""
    }
    return this.getDayFromDate(str2);
  }
  //מחלצת שעות מזמן
  hours(time: number): string {
    var h = Math.floor(time / 60);
    if (h < 10) {
      return "0" + h
    }
    return h.toString()
  }
  //מחלצת דקות מזמן
  minutes(time: number): string {

    var m = time % 60;
    if (m < 10) {
      return "0" + m
    }
    return m.toString()
  }
  //מחלצת שעות מזמן
  hours2(time: number): string {
    return (Math.floor(time / 60)).toString();
  }
  //מחלצת דקות מזמן
  minutes2(time: number): string {
    return (time % 60).toString();
  }

  //תצוגת תאריך
  displayDate(date: string) {
    const [year, month, day] = date.split('-');
    //const dateObj = new Date(year, month - 1, day);
    var yearSh = year.toString().substring(2, 4)
    return day + "." + month + "." + yearSh
  }
  // מחזירה תאריך ללא כפילויות
  displayDate2(i: number, y: number) {
    var str2 = this.listOfAcitivities[y].AFS_date
    if (i == -1) {
      return this.displayDate(str2)
    }
    var str1 = this.listOfAcitivities[i].AFS_date
    if (str1 === str2) {
      return ""
    }
    return this.displayDate(str2);
  }
  //מיון
  onOrderSelected(event: Event) {
    const code = Number((event.target as HTMLInputElement).value);
    this.order = code;
    this.generalActivities();
  }
  //סינון מגדר
  onSelectedGenderF(event: Event) {
    const code = Number((event.target as HTMLInputElement).value);
    this.genderF = code;
    this.generalActivities();
    this.generalWorkers();
    this.generalStudent();
  }
  //סינון פעיל
  onSelectedWorkerF(event: Event) {
    const code = Number((event.target as HTMLInputElement).value);
    this.workerF = code;
    this.generalActivities();
    this.generalStudent();
  }
  //סינון סטטוס פעיל
  onSelectedWorkerStatusF(event: Event) {
    const code = Number((event.target as HTMLInputElement).value);
    this.workerStatusF = code;
    this.generalActivities();
    this.generalWorkers()
    this.generalStudent();
  }
  //סינון חניך
  onSelectedStudentF(event: Event) {
    const code = Number((event.target as HTMLInputElement).value);
    this.studentF = code;
    this.generalActivities();
  }
  //סינון חודש
  onSelectedMonthF(event: Event) {
    const code = Number((event.target as HTMLInputElement).value);
    this.monthF = code;
    this.generalActivities();
  }
  //סינון קטגוריה
  onSelectedCategoryF(event: Event) {
    const code = Number((event.target as HTMLInputElement).value);
    this.categoryF = code;
    this.generalActivities();
  }
  //השוואה בין תאריכים
  compareDates(i: number, y: number): boolean {
    if (y == this.listOfAcitivities.length) {
      return false
    }

    var date1 = this.listOfAcitivities[i].AFS_date;
    var date2 = this.listOfAcitivities[y].AFS_date;
    const [year1, month1, day1] = date1.split('-').map(Number);
    const [year2, month2, day2] = date2.split('-').map(Number);
    const dateObj1 = new Date(year1, month1 - 1, day1);
    const dateObj2 = new Date(year2, month2 - 1, day2);
    return dateObj1 > dateObj2;
  }
  //השוואה בין השמות חניכים
  compareStudents(i: number, y: number) {
    if (y == this.listOfAcitivities.length) {
      return false
    }
    var str1 = this.nameStudent(this.listOfAcitivities[i]?.StudentForActivities[0]?.SFA_code_student)
    var str2 = this.nameStudent(this.listOfAcitivities[y]?.StudentForActivities[0]?.SFA_code_student)
    return str1 === str2;
  }
  //השוואה בין השמות פעילים
  compareWorkers(i: number, y: number) {
    if (y == this.listOfAcitivities.length) {
      return false
    }
    var str1 = this.nameWorker(this.listOfAcitivities[i].AFS_worker_code)
    var str2 = this.nameWorker(this.listOfAcitivities[y].AFS_worker_code)
    return str1 === str2;
  }
  //מדפיס
  public print(): void {
    // להגדיר את העמוד לרוחב
    const style = document.createElement('style');
    style.innerHTML = '@media print { @page { size: landscape; } }';
    document.head.appendChild(style);

    window.print();

  }
  //כמות
  amountW() {
    this.amounts[0] = 0;
    this.amounts[1] = 0;
    this.amounts[2] = 0;
    this.amounts[3] = 0;
    this.amounts[0] = this.listOfAcitivities.length;
    this.listOfAcitivities.forEach(a => {
      this.amounts[1] += a.AFS_activity_time;
      this.amounts[2] += a.AFS_price;
      this.amounts[3] += a.AFS_kilometer;
    });
  }
  //חיפוש עובד
  onInputChangeSearchWorker(event: Event) {
    this.searchTextWorker = (event.target as HTMLInputElement).value;
    this.api.FindActivities(this.searchTextWorker, this.searchTextStudent, this.order, this.genderF, this.workerF, this.workerStatusF, this.studentF, this.monthF, this.yearF, this.categoryF).subscribe(Date => {
      this.listOfAcitivities = [];
      this.listOfAcitivities.push(...Date);
      this.cdRef.detectChanges();
      this.amountW();

    });



  }
  //חיפוש חניך
  onInputChangeSearchStudent(event: Event) {
    this.searchTextStudent = (event.target as HTMLInputElement).value;
    this.api.FindActivities(this.searchTextWorker, this.searchTextStudent, this.order, this.genderF, this.workerF, this.workerStatusF, this.studentF, this.monthF, this.yearF, this.categoryF).subscribe(Date => {
      this.listOfAcitivities = [];
      this.listOfAcitivities.push(...Date);
      this.cdRef.detectChanges();
      this.amountW();

    });



  }
  //מוסיפה פסיקים
  addCommasToNumber(num: number): string {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }
  //סינון לפי שנים

  generateYears(): number[] {
    const currentYear = new Date().getFullYear();
    /*     const startYear = 2024;
        const endYear = currentYear; */
    const startYear = currentYear;
    const endYear = 2020;
    return Array.from({ length:startYear- endYear + 1 }, (_, i) => startYear - i);

  }



  onSelectedYearF(event: Event) {
    this.yearF = Number((event.target as HTMLInputElement).value);
  }
  //אם קוד קטגוריה קיים ברשימת הקטגוריות לפעילות
  async ifExist(num: number, list: Array<CategoriesForActivity>) {
    let d = false
    await new Promise<void>((resolve, reject) => {
      list.forEach(element => {
        if (element.CFA_code_type_activity == num)
          d = true
        resolve()
      });
    });
    return d;
  }
  //ערוך פעילות
  async edit(activity: Activity) {
    await new Promise<void>(async (resolve, reject) => {

      this.updateActivity = activity;
      activity.CategoriesForActivities.forEach(cat => {
        if (cat.CFA_code_type_activity == 8) {
          this.displayGroupActivities = true
        }
      });
      //תאריך
      this.selectedDate = new Date(activity.AFS_date);
      //זמן
      let hours = (Math.floor(activity.AFS_activity_time / 60));
      let minutes = (activity.AFS_activity_time % 60);
      this.selectedDate.setHours(hours);
      this.selectedDate.setMinutes(minutes);

      //הארות קצר
      if (await this.ifExist(5, activity.CategoriesForActivities) && await this.ifExist(6, activity.CategoriesForActivities)) {
        const parts = this.updateActivity.AFS_short_description.split(',');
        this.gift = parts[0]?.trim() || '';
        this.out = parts[1]?.trim() || '';
      }
      else {
        if (await this.ifExist(5, activity.CategoriesForActivities))
          this.gift = this.updateActivity.AFS_short_description
        if (await this.ifExist(6, activity.CategoriesForActivities))
          this.out = this.updateActivity.AFS_short_description
        if (await this.ifExist(7, activity.CategoriesForActivities)) {
          this.school = this.updateActivity.AFS_short_description;
        }
      }
      resolve()
    });
    const today = new Date();
    const yesterday = new Date(today);
    const beforeyesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);
    beforeyesterday.setDate(today.getDate() - 2);
    this.displayToday = this.selectedDate.getFullYear() == today.getFullYear() && this.selectedDate.getMonth() == today.getMonth() && this.selectedDate.getDate() == today.getDate();
    this.displayYesterday = this.selectedDate.getFullYear() == yesterday.getFullYear() && this.selectedDate.getMonth() == yesterday.getMonth() && this.selectedDate.getDate() == yesterday.getDate();
    this.displayBeforeYesterday = this.selectedDate.getFullYear() == beforeyesterday.getFullYear() && this.selectedDate.getMonth() == beforeyesterday.getMonth() && this.selectedDate.getDate() == beforeyesterday.getDate();

    this.sUpdateActivity = true;
  }
  //סגירת הפופפ
  closePUpdate(display: boolean) {
    this.sUpdateActivity = display;
    this.displayToday = false
    this.displayYesterday = false
    this.displayBeforeYesterday = false
    this.displayGroupActivities = false
    this.gift = ""
    this.out = ""
    this.school = ""
    this.generalActivities();
    this.generalCategories();
    /*     this.time.setHours(0);
        this.time.setMinutes(0); */
  }
}