import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Student } from '../../models/student.class';
import { TypeGender } from '../../models/TypeGender.enum';
import { Parentt } from '../../models/parent.class';
import { ApiService } from '../../services/api.service';
import { Worker } from '../../models/worker.class';
import { StudiesForStudent } from '../../models/studiesForStudent.class';
import { City } from '../../models/city.class';
import { TypeActivityState } from '../../models/typeActivityState.enum';
import { TypeRisk } from '../../models/TypeRisk.enum';
import { DifficultyStudent } from '../../models/difficultyStudent.class';
import { TypeDifficulty } from '../../models/TypeDifficulty.enum';
import { Frequency } from '../../models/frequency.enum';
import { Community } from '../../models/community.class';
import { Synagogue } from '../../models/synagogue.class';
import { Project } from '../../models/project.class';
import { GuideForProject } from '../../models/guideForProject.class';
import { StudentForProject } from '../../models/studentForProject.class';
import { HDate } from '@hebcal/core';
@Component({
  selector: 'app-display-student',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './display-student.component.html',
  styleUrl: './display-student.component.scss'
})
export class DisplayStudentComponent implements OnInit {

  @Input() selectedImage: string = "";

  @Input() student: Student = new Student(111, "", 1, "", "", "", "", 1, 1, 1, "", "", "", "", 1, 1, 1, "", "", "", 1, "", 1, 1, 1, "", "", "")

  @Input() popupDisplayIn: boolean = false;
  @Output() popupDisplayOut: EventEmitter<boolean> = new EventEmitter()
  selectedImage2: string = './boy.png';
  @Input() Parent: Parentt = new Parentt(111, "", "", "", "")
  @Input() Parent1: Parentt = new Parentt(111, "", "", "", "")
  @Input() DifficultyStudent: Array<DifficultyStudent> = []
  @Input() Worker: Worker = new Worker(111, "", 1, 1, "", "", "", "", "", 1)
  @Input() StudiesForStudent: StudiesForStudent = new StudiesForStudent(111, 1, "", "", "", "", "", "")
  print() {
    const style = document.createElement('style');
    style.innerHTML = '@media print { @page { size: portrait; } }';
    document.head.appendChild(style);

    window.print();
  }
  @Input() listStudentForProjects: Array<StudentForProject> = []

  //פרויקטים
  listProject: Array<Project> = []
  //מדריכים
  listGuides: Array<GuideForProject> = []
  //ערים
  lisOfCities: Array<City> = []
  //קשיים 
  //listOfDifficultiesForStudent: Array<DifficultyStudent> = []
  //רשימת קהילות
  listOfCommunities: Array<Community> = []
  //רשימת בתי כנסת
  listOfsynagogueis: Array<Synagogue> = []
  codeCommonity = -1
  constructor(private api: ApiService, private cdRef: ChangeDetectorRef) {

  }
  ngOnInit(): void {
    this.generalCities();
    this.generalCommunities()
    this.generalSynagogueis()
    this.generalProjects()
    this.generalGuides();
  }


  //קהילות
  public generalCommunities() {
    this.api.GetAllCommunities().subscribe(Date => {
      this.listOfCommunities = []
      this.listOfCommunities.push(...Date);
      this.cdRef.detectChanges();
    })
  }
  //בתי כנסת
  public generalSynagogueis() {
    this.api.GetAllSynagoguesOfCommunity(this.codeCommonity).subscribe(Date => {
      this.listOfsynagogueis = []
      this.listOfsynagogueis.push(...Date);
      this.cdRef.detectChanges();
    })
  }
  //שם קהילה
  CommunityName(codeSynagogue: number | undefined) {
    if (codeSynagogue)
      return this.listOfCommunities.find(c => this.listOfsynagogueis.find(s => s.Sy_code == codeSynagogue)?.Sy_code_Community == c.Com_code)?.Com_name
    return ""
  }
  //שם בית כנסת
  SynagogueName(codeSynagogue: number | undefined) {
    if (codeSynagogue)
      return this.listOfsynagogueis.find(s => s.Sy_code == codeSynagogue)?.Sy_name
    return ""
  }
  //ערים
  public generalCities() {
    this.api.getCities().subscribe(Date => {
      this.lisOfCities.push(...Date);
      this.cdRef.detectChanges();
    })

  }
  //שם עיר
  public city(codeCity: number | undefined) {
    if (codeCity)
      return this.lisOfCities.find(c => c.Ci_code == codeCity)?.Ci_name
    return ""
  }
  //פרויקטים
  generalProjects() {
    this.api.getProgects(0, "").subscribe(Date => {
      this.listProject = []
      this.listProject.push(...Date);
      this.cdRef.detectChanges();
    })
  }
  //שם פרויקט
  public projectName(codeProject: number) {
    return this.listProject.find(p => p.Pr_code == codeProject)?.Pr_name
  }
  //מדריכים
  generalGuides() {
    this.api.getGuidesForProjects(-1).subscribe(Date => {
      this.listGuides = []
      this.listGuides.push(...Date);
      this.cdRef.detectChanges();
    })
  }
  //שם מדריך
  public GuideName(codeGuide: number) {
    return this.listGuides.find(g => g.GFP_code == codeGuide)?.GFP_name
  }
  //קשיים
  /*  public difficultiesStudent(codeStudent: number): Array<DifficultyStudent> {
     console.log("קשייםםםםםםם",this.listOfDifficulties)
     const listOfDifficultiesForStudent: Array<DifficultyStudent> = []
     this.listOfDifficulties.forEach(d => {
       if (d.DS_student_code == codeStudent) {
         listOfDifficultiesForStudent.push(d);
       }
     });
     return listOfDifficultiesForStudent;
   } */
  //סגירת הפופפ
  public close(): void {
    this.popupDisplayOut.emit(false)
  }
  //מחזיר את סוג המגדר
  public typeGender(num: number): string {
    return TypeGender[num];
  }
  //מחזיר גיל מדויק

  calculateAge(dateString: string): number {
    // פיצול המחרוזת לתאריך
    const birthDate = new Date(dateString);

    // תאריך היום
    const today = new Date();

    // מציאת ההפרש בין השנה הנוכחית לשנת הלידה
    let age = today.getFullYear() - birthDate.getFullYear();

    // בדיקה אם יום ההולדת עוד לא עבר בשנה זו
    const monthDifference = today.getMonth() - birthDate.getMonth();
    if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }

    return age;
  }
  //חישוב גיל
  calculateAgeInYearsAndMonths(dateString: string): string {
    let dddd = this.getExactAgeFromHebrewDate(this.student.St_hebrew_date)
    if (dddd! != 0) {
      return dddd.toString()
    }
    else {
      const birthDate = new Date(dateString);
      const today = new Date();

      let ageInMonths = (today.getFullYear() - birthDate.getFullYear()) * 12;
      ageInMonths -= birthDate.getMonth() + 1;
      ageInMonths += today.getMonth();

      let ageInYears = Math.floor(ageInMonths / 12);
      let remainderMonths = ageInMonths % 12;


      let age = ageInYears + remainderMonths / 12;
      if (!parseFloat(age.toFixed(1))) {
        return ""
      }
      return parseFloat(age.toFixed(1)).toString();
    }

  }

  getExactAgeFromHebrewDate(hebrewDateStr: string): number {
    const result = this.hebrewDateToNumbers(hebrewDateStr);
    if (result == null) {
      return 0;;

    } else {
      const [hDay, hMonth, hYear] = result;
      console.log(hDay+" "+hMonth+" "+hYear)
      // יצירת תאריך עברי
      const hebrewDate = new HDate(hYear, hMonth, hDay);
      const hdate = new HDate(hebrewDate);
      const birthDate = hdate.greg(); // המרה לתאריך לועזי

      const today = new Date();

      // הפרש בשנים (מדויק)
      const millisecondsInYear = 365.25 * 24 * 60 * 60 * 1000;
      const ageInMilliseconds = today.getTime() - birthDate.getTime();
      const age = ageInMilliseconds / millisecondsInYear;

      // גיל עם 2 ספרות אחרי הנקודה
      return parseFloat(age.toFixed(2));
    }
  }
  hebrewDateToNumbers(hebrewDate: string): [number, number, number] | null {
    // מיפוי ספרות עבריות למספרים
    const hebrewNumbers: { [key: string]: number } = {
      'א': 1, 'ב': 2, 'ג': 3, 'ד': 4, 'ה': 5, 'ו': 6, 'ז': 7, 'ח': 8, 'ט': 9,
      'י': 10, 'כ': 20, 'ל': 30, 'מ': 40, 'נ': 50, 'ס': 60, 'ע': 70, 'פ': 80, 'צ': 90,
      'ק': 100, 'ר': 200, 'ש': 300, 'ת': 400
    };

    // מיפוי שמות חודשים למספרים
    const monthsMap: { [key: string]: number } = {
      'תשרי': 1,
      'חשון': 2,
      'כסלו': 3,
      'טבת': 4,
      'שבט': 5,
      'אדר': 6,
      'אדר א׳': 6,
      'אדר ב׳': 7,
      'ניסן': 7,
      'אייר': 8,
      'סיון': 9,
      'תמוז': 10,
      'אב': 11,
      'אלול': 12
    };

    // פונקציה לפרש יום/שנה מחלקי האותיות העבריות למספרים
    function parseHebrewNumber(str: string): number {
      let total = 0;
      for (const char of str) {
        if (hebrewNumbers[char]) {
          total += hebrewNumbers[char];
        }
      }
      return total;
    }

    // פיצול המחרוזת לרכיבים (יום, חודש, שנה)
    const parts = hebrewDate.split(' ');

    if (parts.length < 3) return null;

    // המרת היום
    const day = parseHebrewNumber(parts[0]);

    // המרת החודש
    const monthName = parts[1];
    const month = monthsMap[monthName];
    if (!month) return null;

    // המרת השנה - למשל "תשע\"ד"
    const yearHebrew = parts.slice(2).join(''); // לאחד במקרה ויש רווחים

    // המרה של השנה העברית לטווח מספרי - לדוגמה, תשע"ד = 5774
    // נפרק את השנה: תשע"ד -> ת (400), ש (300), ע (70), ד (4) = 774
    // נוסיף 5000 כי שנים במאה ה-21 הן 5000+
    const yearWithoutGershayim = yearHebrew.replace(/["״׳]/g, '');
    const yearNum = parseHebrewNumber(yearWithoutGershayim) + 5000;

    return [day, month, yearNum];
  }


  /* //חישוב גיל עברי
    calculateHebrewAge(hebrewDateStr: string): number {
      try {
        const parts = hebrewDateStr.trim().split(' ');
        if (parts.length !== 3) return 0;;
  
        const [dayHeb, monthHeb, yearHeb] = parts;
  
        // המרת יום ל-מספר
        const hebrewDays = {
          'א': 1, 'ב': 2, 'ג': 3, 'ד': 4, 'ה': 5, 'ו': 6, 'ז': 7, 'ח': 8, 'ט': 9,
          'י': 10, 'יא': 11, 'יב': 12, 'יג': 13, 'יד': 14, 'טו': 15, 'טז': 16,
          'יז': 17, 'יח': 18, 'יט': 19, 'כ': 20, 'כא': 21, 'כב': 22, 'כג': 23,
          'כד': 24, 'כה': 25, 'כו': 26, 'כז': 27, 'כח': 28, 'כט': 29, 'ל': 30
        };
  
        const months = {
          'תשרי': 1, 'חשוון': 2, 'כסלו': 3, 'טבת': 4, 'שבט': 5, 'אדר': 6, 'אדר א': 6, 'אדר ב': 7,
          'ניסן': 8, 'אייר': 9, 'סיון': 10, 'תמוז': 11, 'אב': 12, 'אלול': 13
        };
        const day = hebrewDays[dayHeb as keyof typeof hebrewDays];
        const month = months[monthHeb as keyof typeof months];
  
        const year = this.hebrewYearToNumber(yearHeb);
  
        if (!day || !month || !year) return 0;
  
        const hDate = new HDate(day, month, year);
        const gregorianDate = hDate.greg();
  
        const today = new Date();
        let age = today.getFullYear() - gregorianDate.getFullYear();
  
        // תיקון אם עוד לא הגיע יום ההולדת השנה
        const m1 = today.getMonth();
        const d1 = today.getDate();
        const m2 = gregorianDate.getMonth();
        const d2 = gregorianDate.getDate();
  
        if (m1 < m2 || (m1 === m2 && d1 < d2)) {
          age--;
        }
  
        return age;
      } catch {
        return 0;
      }
    } */

  /*   // המרה משנה עברית (לדוג' "תשס"ד") לשנה מספרית
    hebrewYearToNumber(yearStr: string): number | null {
      const gematriaMap: Record<string, number> = {
        'א': 1, 'ב': 2, 'ג': 3, 'ד': 4, 'ה': 5, 'ו': 6, 'ז': 7, 'ח': 8, 'ט': 9,
        'י': 10, 'כ': 20, 'ל': 30, 'מ': 40, 'נ': 50, 'ס': 60, 'ע': 70,
        'פ': 80, 'צ': 90, 'ק': 100, 'ר': 200, 'ש': 300, 'ת': 400
      };
  
      const sanitized = yearStr.replace(/["״׳"]/g, '').replace('תש', 'ש'); // מאפשר גם קלט כמו תש"פ
      let year = 5000; // המאה ה-6 (תשס"ד זה 5764)
  
      for (const letter of sanitized) {
        if (gematriaMap[letter]) {
          year += gematriaMap[letter];
        } else {
          return null;
        }
      }
  
      return year+400;
    } */

  //שם מצב פעילות
  public typeSA(num: number): string {
    return TypeActivityState[num]
  }
  //שם מצב סיכון
  public typeRisk(num: number | undefined): string {
    if (num)
      return TypeRisk[num]
    return ""
  }
  //שם קושי
  public TypeDiffi(num: number): string {
    return TypeDifficulty[num];
  }
  //שם תדירות
  Frequency(num: number | undefined): string {
    if (num)
      return Frequency[num]
    return ""
  }
  convertDateBack(dateStr: string) {
    if (dateStr.length > 0) {
      const [year, month, day] = dateStr.split('-');
      return `${day.padStart(2, '0')}/${month.padStart(2, '0')}/${year}`;
    }
    return "";

  }
}
