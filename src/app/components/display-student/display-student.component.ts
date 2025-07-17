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
    let dddd = this.calculateHebrewAge(this.student.St_hebrew_date)
    if (dddd != 0) {
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
  parseHebrewDay(dayStr: string) {
    const gematriaMap = { 'א': 1, 'ב': 2, 'ג': 3, 'ד': 4, 'ה': 5, 'ו': 6, 'ז': 7, 'ח': 8, 'ט': 9, 'י': 10, 'כ': 20, 'ל': 30 };
    let total = 0;
    for (const ch of dayStr) total += gematriaMap[ch as keyof typeof gematriaMap] || 0;
    return total;
  }
  hebrewYearStringToNumber(hebrewStr: string) {
    const gematriaMap = {
      'א': 1, 'ב': 2, 'ג': 3, 'ד': 4, 'ה': 5, 'ו': 6, 'ז': 7, 'ח': 8, 'ט': 9,
      'י': 10, 'כ': 20, 'ל': 30, 'מ': 40, 'נ': 50, 'ס': 60, 'ע': 70, 'פ': 80, 'צ': 90,
      'ק': 100, 'ר': 200, 'ש': 300, 'ת': 400
    };
    let year = 0;
    for (const char of hebrewStr.replace(/["״׳]/g, '')) {
      year += gematriaMap[char as keyof typeof gematriaMap] || 0;
    }
    return 5000 + year; // כל השנים אחרי 5000
  }
  calculateHebrewAgeContinue(birthDay: number, birthMonth: number, birthYear: number, today: Date) {
    const hToday = new HDate(today);
    let age = hToday.getFullYear() - birthYear;
    return age;
  }
  calculateHebrewAge(hebrewDateStr: string) {
    const hebrewMonthMap = {
      'ניסן': 1, 'אייר': 2, 'סיון': 3, 'תמוז': 4, 'אב': 5, 'אלול': 6,
      'תשרי': 7, 'חשוון': 8, 'מרחשוון': 8, 'כסליו': 9, 'טבת': 10, 'שבט': 11,
      'אדר': 12, 'אדר א׳': 12, 'אדר א': 12, 'אדר ב׳': 13, 'אדר ב': 13
    };
    if (!hebrewDateStr) return 0;

    const parts = hebrewDateStr.split(" ");
    if (parts.length < 3) return 0;

    const [dayStr, monthStr, yearStr] = parts;
    if (!dayStr || !monthStr || !yearStr) return 0;
    const day = this.parseHebrewDay(dayStr);
    const month = hebrewMonthMap[monthStr as keyof typeof hebrewMonthMap];
    const year = this.hebrewYearStringToNumber(yearStr);

    if (!day || !month || !yearStr) return 0;
    let age = null;
    const today = new Date();
    age = this.calculateHebrewAgeContinue(day, month, year, today);
    return age;
  }

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
