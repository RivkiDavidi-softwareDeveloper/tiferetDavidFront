import { ChangeDetectorRef, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../services/api.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Activity } from '../../models/activity.class';
import { Worker } from '../../models/worker.class';
import { StudentForActivity } from '../../models/studentForActivity.class';
import { Student } from '../../models/student.class';
import { CategoriesForActivity } from '../../models/categoriesForActivity.class';
import { TypeOfActivity } from '../../models/TypeOfActivity.enum';


@Component({
  selector: 'app-reports',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './reports.component.html',
  styleUrl: './reports.component.scss'
})
export class ReportsComponent {
  listOfAcitivities: Array<Activity> = [];
  listOfWorkers: Array<Worker> = [];
  listOfStudentsForActivity: Array<StudentForActivity> = [];
  listOfStudent: Array<Student> = [];
  listOfCategoriesForActivity: Array<CategoriesForActivity> = [];
  monthes: Array<string> = ['ינואר', 'פברואר', 'מרץ', 'אפריל', 'מאי', 'יוני', 'יולי', 'אוגוסט', 'ספטמבר', 'אוקטובר', 'נובמבר', 'דצמבר']
  order = 1
  genderF = 0
  workerF = -1
  studentF = -1
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

  }
  //רשימת הפעילויות
  generalActivities() {
    this.api.FindActivities(this.searchTextWorker, this.searchTextStudent, this.order, this.genderF, this.workerF, this.studentF, this.monthF, this.yearF, this.categoryF).subscribe(Date => {
      this.listOfAcitivities = [];
      this.listOfAcitivities.push(...Date);
      this.cdRef.detectChanges();
      this.amountW()

    });
  }
  //רשימה של פעילים
  generalWorkers() {
    this.api.FindWorker("", 0, this.genderF, 0, 0).subscribe(Date => {

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
        name = w.Wo_name + " " + w.Wo_Fname;
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
        name = s.St_name + " " + s.St_Fname;
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
/*     this.generalStudent();
 */  }
  //סינון פעיל
  onSelectedWorkerF(event: Event) {
    const code = Number((event.target as HTMLInputElement).value);
    this.workerF = code;
    this.generalActivities();
/*     this.generalStudent();
 */  }
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
    // הוסף את תוכן הכותרת העליונה והתחתונה
    const header = document.createElement('div');
    header.innerHTML = '<div style="text-align: left;"><img src="./logoTbig.png" style="width: 100px; height: 100px;" /></div>';

    const footer = document.createElement('div');
    footer.innerHTML = '<div style="text-align: center;">כותרת תחתונה</div>';

    // עדכן את הכותרת התחתונה כדי להציג רק את דף המס
    footer.innerHTML = '<div style="text-align: center;">עמוד מס</div>';

    // הוסף לוגו בצד שמאל של הכותרת
    header.innerHTML = '<div style="text-align: left;"><img src="./logoTbig.png" style="width: 100px; height: 100px;" /></div>';

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
    this.api.FindActivities(this.searchTextWorker, this.searchTextStudent, this.order, this.genderF, this.workerF, this.studentF, this.monthF, this.yearF, this.categoryF).subscribe(Date => {
      this.listOfAcitivities = [];
      this.listOfAcitivities.push(...Date);
      this.cdRef.detectChanges();
      this.amountW();

    });



  }
  //חיפוש חניך
  onInputChangeSearchStudent(event: Event) {
    this.searchTextStudent = (event.target as HTMLInputElement).value;
    this.api.FindActivities(this.searchTextWorker, this.searchTextStudent, this.order, this.genderF, this.workerF, this.studentF, this.monthF, this.yearF, this.categoryF).subscribe(Date => {
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
    const startYear = 2024;
    const endYear = currentYear;
    return Array.from({ length: endYear - startYear + 1 }, (_, i) => startYear + i);
  }



  onSelectedYearF(event: Event) {
    this.yearF = Number((event.target as HTMLInputElement).value);
  }




















  /* 
  getHebrewDateInWords(dateString: string): string {

    var hebrewDate = require("hebrew-date");

    // When not providing a date object, the months are one-indexed
    console.log(hebrewDate(2016, 10, 2));
    // { year: 5776, month: 13, date: 29, month_name: 'Elul' }

    var october = 9;
    console.log(hebrewDate(new Date(2016, october, 3)));
    // { year: 5777, month: 1, date: 1, month_name: 'Tishri' }
    const parts = dateString.split('-'); // פיצול התאריך לתתי חלקים על פי המחלקים ביניהם קווים מפרידים
    const year = parseInt(parts[0], 10); // המרת החלק הראשון למספר שלם
    const month = parseInt(parts[1], 10); // המרת החלק השני למספר שלם
    const day = parseInt(parts[2], 10); // המרת החלק השלישי למספר שלם
    const date = new hebrewDate(year, month, day); // יצירת אובייקט תאריך עברי
    return date.toString(); // החזרת התאריך העברי במילים
  }
  convertToHebrewNumerals(year: number): string {
    const hebrewUnits = ['א׳', 'ב׳', 'ג׳', 'ד׳', 'ה׳', 'ו׳', 'ז׳', 'ח׳', 'ט׳', 'י׳'];
    const hebrewTens = ['יא׳', 'יב׳', 'יג׳', 'יד׳', 'ט״ו', 'ט״ז', 'יז׳', 'יח׳', 'יט׳', 'כ׳'];
    const hebrewHundreds = ['ק׳', 'ר׳', 'ש״א', 'ש״ב', 'ת״ג', 'ת״ד', 'ת״ה', 'ת״ו', 'ת״ז', 'ת״ח'];
  
    const units = year % 10;
    const tens = Math.floor((year % 100) / 10) - 1;
    const hundreds = Math.floor((year % 1000) / 100);
  
    let hebrewYear = '';
  
    if (hundreds > 0) {
      hebrewYear += hebrewHundreds[hundreds - 1];
    }
    if (tens >= 0) {
      hebrewYear += hebrewTens[tens];
    }
    if (units > 0 || year === 0) {
      hebrewYear += hebrewUnits[units - 1];
    }
  
    return hebrewYear;
  }
   getHebrewDateInWords2(dateString: string): string {
  const hebrewMonths = [
    'טבת', 'שבט', 'אדר','ניסן', 'אייר', 'סיון', 'תמוז', 'אב', 'אלול',
    'תשרי', 'חשון', 'כסלו', 
  ];

  const parts = dateString.split('-');
  const year  = parseInt(parts[0], 10);
  const month = parseInt(parts[1], 10);
  const day = parseInt(parts[2], 10);

  const hebrewMonth = hebrewMonths[month - 1];
  const hebrewYear = this.convertToHebrewNumerals(year);


  console.log(new Intl.DateTimeFormat('he-IL-u-ca-hebrew').format(new Date(year,month,day)));

  return `${day} ${hebrewMonth} ${hebrewYear}`;
}
 convertForeignDateToHebrewDate(foreignDate: string): string {
    const date = new Date(foreignDate);
    const dayOfWeek = date.toLocaleDateString('en-US', { weekday: 'long' });
    const month = date.getMonth() + 1;
    
    let hebrewDate = "";

    if (month === 1) {
        hebrewDate = `${dayOfWeek} in the tribe of the Shapad`;
    } else {
        const century = Math.ceil(date.getFullYear() / 100);
        hebrewDate = `${date.getDate()} in the end of the ${century}th century`;
    }

    return hebrewDate;
}
getHebrewDate(foreignDate: string): string{
  const [year, month, day] = foreignDate.split('-').map(Number);
  
  const hebrewDays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const hebrewMonths = ['Tishrei', 'Cheshvan', 'Kislev', 'Tevet', 'Shevat', 'Adar', 'Nisan', 'Iyar', 'Sivan', 'Tammuz', 'Av', 'Elul'];

  const hebrewDay = hebrewDays[new Date(year, month - 1, day).getDay()];
  const hebrewMonth = hebrewMonths[month - 1];
  
  const tribe = ['Reuven', 'Shimon', 'Levi', 'Yehuda', 'Yissachar', 'Zevulun', 'Dan', 'Naftali', 'Gad', 'Asher', 'Yosef', 'Binyamin'];
  const tribeIndex = (year + Math.floor(year / 4) - Math.floor(year / 100) + Math.floor(year / 400) + [0, 3, 5, 1][month - 1] + day) % 12;
  const tribeName = tribe[tribeIndex];
  
  return `${hebrewDay} in the tribe of the ${tribeName}`;
} 
 
// Example usage
console.log(getHebrewDate('2024-01-15')); // Thursday in the tribe of the Shapad
console.log(getHebrewDate('2023-12-03')); // 20 in the end of the 20th century
 
console.log(convertForeignDateToHebrewDate('2024-01-15')); // Output: Thursday in the tribe of the Shapad
console.log(convertForeignDateToHebrewDate('2023-12-03')); // Output: 20 in the end of the 20th century

// דוגמה לשימוש:
const dateString = '31-03-2024';
const hebrewDate = getHebrewDateInWords(dateString);
console.log('Hebrew Date:', hebrewDate);  // דוגמה לשימוש:
  const dateString = '31-03-2024'; // תאריך לדוגמה בפורמט "dd-mm-yyyy"
  const hebrewDate = getHebrewDateInWords(dateString); // קריאה לפונקציה ושליחת המחרוזת כארגומנט
  console.log('Hebrew Date:', hebrewDate); // הדפסת התאריך העברי במילים
 
    // דוגמה לשימוש:
    const dateString = '31-03-2024'; // תאריך לדוגמה בפורמט "dd-mm-yyyy"
    const dayOfWeek = getDayFromDate(dateString); // קריאה לפונקציה ושליחת המחרוזת כארגומנט
  console.log('Day of week:', dayOfWeek); // הדפסת היום בשבוע של התאריך */

}
