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
import { Sharer } from '../../models/sharer.class';
import { StudiesForSharer } from '../../models/studiesForSharer.class';
import { Project } from '../../models/project.class';
import { SharerForProject } from '../../models/sharerForProject.class';
import { GuideForProject } from '../../models/guideForProject.class';

@Component({
  selector: 'app-display-sharer',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './display-sharer.component.html',
  styleUrl: './display-sharer.component.scss'
})
export class DisplaySharerComponent {

  @Input() sharer: Sharer = new Sharer(-1, "", 1, "", "", "", 1, 1, 1, "", "", "", "")

  @Input() popupDisplayIn: boolean = false;
  @Output() popupDisplayOut: EventEmitter<boolean> = new EventEmitter()
  @Input() Parent: Parentt = new Parentt(111, "", "", "", "")
  @Input() Parent1: Parentt = new Parentt(111, "", "", "", "")
  @Input() StudiesForSharer: StudiesForSharer = new StudiesForSharer(111, 1, "", "", "", "", "", "")


  @Input() listSharerForProjects: Array<SharerForProject> = []
  print() {
    const style = document.createElement('style');
style.innerHTML = '@media print { @page { size: portrait; } }';
document.head.appendChild(style);

    window.print();
  }

  //ערים
  lisOfCities: Array<City> = []
  //פרויקטים
  listProject: Array<Project> = []
  //מדריכים
  listGuides: Array<GuideForProject> = []
  constructor(private api: ApiService, private cdRef: ChangeDetectorRef) {

  }
  ngOnInit(): void {
    this.generalCities();
    this.generalProjects()
    this.generalGuides();
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
    return this.listGuides.find(g=>g.GFP_code==codeGuide)?.GFP_name
  }
  //ערים
  public generalCities() {
    this.api.getCities().subscribe(Date => {
      this.lisOfCities.push(...Date);
      this.cdRef.detectChanges();
    })

  }
  //שם עיר
  public city(codeCity: number) {
    return this.lisOfCities.find(c => c.Ci_code == codeCity)?.Ci_name
  }
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
  //המרת סוג תאריך
  convertDateBack(dateStr: string) {
    if (dateStr.length > 0) {
      const [year, month, day] = dateStr.split('-');
      return `${day.padStart(2, '0')}/${month.padStart(2, '0')}/${year}`;
    }
    return "";

  }
}
