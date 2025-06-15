
import { Component, EventEmitter, Input, Output, AfterViewInit, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../services/api.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Parentt } from '../../models/parent.class';
import { combineLatest } from 'rxjs';
import { delay } from 'rxjs/operators';
import { City } from '../../models/city.class';
import { LoadingSpinnerComponent } from "../loading-spinner/loading-spinner.component";
import { Sharer } from '../../models/sharer.class';
import { StudiesForSharer } from '../../models/studiesForSharer.class';
import { SharerForProject } from '../../models/sharerForProject.class';
import { Project } from '../../models/project.class';
import { GuideWithRelations } from '../../models/guideWithRelations.interface';

@Component({
  selector: 'app-update-sharer',
  standalone: true,
  imports: [CommonModule, LoadingSpinnerComponent],
  templateUrl: './update-sharer.component.html',
  styleUrl: './update-sharer.component.scss'
})
export class UpdateSharerComponent {
  @Input() status: string = 'add';
  @Input() popupDisplayIn: boolean = false;

  //ערים
  lisOfCities: Array<City> = []
  genderF = 1
  //לעדכון
  @Input() sharerUpdate: Sharer = new Sharer(111, "4444444444", 1, "", "", "", 1, 1, 1, "", "", "", "")
  @Input() Parent: Parentt = new Parentt(111, "", "", "", "")
  @Input() Parent1: Parentt = new Parentt(111, "", "", "", "")
  @Input() StudiesForSharer: StudiesForSharer = new StudiesForSharer(111, 1, "", "", "", "", "", "")
  //לעדכון פרטי משתתף לפרויקט

  @Input() sharerForProjectUpdate: SharerForProject = new SharerForProject(-1, 1, 1, 1, "", "", this.sharerUpdate)
  @Input() project: Project = new Project(-1, "", "", "", "", "", 1)
  @Input() listOfGuides: Array<GuideWithRelations> = []
  selectedGuideCode: number = -1


  SFP_name_school_bein_hazmanim = ""
  SFP_veshinantem = ""
  validNaneBeinHazmanim = false
  validVeshinantem = false


  @Output() popupDisplayOut: EventEmitter<boolean> = new EventEmitter()
  @Input() cb1: boolean = true;
  @Input() cb2: boolean = false;

  //אנימציה
  loading = false
  //תכונות להוספה
  Sh_code: number = 1
  Sh_ID: string = ""
  Sh_gender: number = 1
  Sh_name: string = ""
  Sh_Fname: string = ""
  Sh_birthday: string = ""
  //הורים
  Pa_code_F: number = 1
  Pa_ID_F: string = ""
  Pa_name_F: string = ""
  Pa_cell_phone_F: string = ""
  Pa_work_F: string = ""

  Pa_code_M: number = 1
  Pa_ID_M: string = ""
  Pa_name_M: string = ""
  Pa_cell_phone_M: string = ""
  Pa_work_M: string = ""

  Sh_city_code: any = -1
  Sh_address: string = ""
  Sh_cell_phone: string = ""
  Sh_phone: string = ""
  Sh_nusah_tfila = ""
  //לימודים
  // SFS_student_code: number=1
  SFS_current_school: string = ""
  SFS_current_school_ame: string = ""
  SFS_reception_class: string = ""
  SFS_current_class: string = ""
  SFS_previous_institutions: string = ""
  SFS_previous_school: string = ""

  //שם עיר להוספה
  addCityStatus = false
  cityName = ""

  ///דגלים לבדיקות תקינות
  validNusahTfila = false

  validNane: boolean = false;
  validNameF: boolean = false;
  validId: boolean = false;
  validCellPhoneStudent: boolean = false;
  validBirthday: boolean = false;
  validAddress: boolean = false
  validPhoneHome: boolean = false
  validNameFather: boolean = false
  validIDFather: boolean = false
  validWorkFather: boolean = false
  validCellPhoneFather: boolean = false
  validNameMother: boolean = false
  validIDMother: boolean = false
  validWorkMother: boolean = false
  validCellPhoneMother: boolean = false
  validCurrentSchoolName: boolean = false;
  validReceptionClass: boolean = false;
  validCurrentClass: boolean = false
  validPreviousInstitutions: boolean = false
  validPreviousSchool: boolean = false;
  validCityName = false

  sec: any = "sec"
  secUpload = "nonnnn"

  @Input() selectedImage: string = "";
  image: File | undefined

  imageBlobURL: string = "";

  //קונסטרקטור
  constructor(private api: ApiService, private snackBar: MatSnackBar, private cdRef: ChangeDetectorRef) { }

  ngOnInit(): void {

    this.generalCities();
  }

  //קומבו בוקס 
  //ערים
  public generalCities() {
    this.api.getCities().subscribe(Date => {
      this.lisOfCities = []
      this.lisOfCities.push(...Date);
      this.cdRef.detectChanges();
    })
  }


  //סגירת הפופפ
  public close(): void {
    this.empty()
    this.popupDisplayOut.emit(false)
  }

  //בדיקות תקינות
  isNumeric(input: string): boolean {
    const numericRegex: RegExp = /^\d+$/;
    return numericRegex.test(input);
  }
  isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
  isValidIsraeliIdNumber(idNumber: string): boolean {
    const idNumberRegex: RegExp = /^[0-9]{9}$/;
    return idNumberRegex.test(idNumber);
  }

  //קליטת ערכים מתוך הינפוטים
  //תמונה
  onFileSelected(event: any): void {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onload = (e: any) => {
      this.selectedImage = e.target.result;
    };
    reader.readAsDataURL(file);
    this.image = file
  }

  //ת.ז
  onInputChangeID(event: Event) {
    const id: string = (event.target as HTMLInputElement).value
    if (this.isValidIsraeliIdNumber(id)) {
      this.Sh_ID = id
      this.validId = false;
    }
    else {

      this.validId = true;
    }
  }
  //שם
  onInputChangeN(event: Event) {
    const name: string = (event.target as HTMLInputElement).value
    if (name.length <= 20) {
      this.Sh_name = name;
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
      this.Sh_Fname = namef
      this.validNameF = false;
    }
    else {
      this.validNameF = true;
    }
  }
  //תאריך לידה
  onInputChangeBirthday(event: Event) {
    const date: string = (event.target as HTMLInputElement).value
    if (date.length == 10) {
      this.Sh_birthday = date
      this.validBirthday = false;

    }
    else {
      this.validBirthday = true;
    }
    this.sharerUpdate.Sh_birthday = date

  }
  //כתובת
  onInputChangeAddress(event: Event) {
    const address: string = (event.target as HTMLInputElement).value
    if (address.length <= 40) {
      this.Sh_address = address
      this.validAddress = false;

    }
    else {
      this.validAddress = true;
    }
  }
  //עיר
  onCitySelected(event: Event) {
    const cityCode = Number((event.target as HTMLInputElement).value);
    if (cityCode == (-2)) {
      this.addCityStatus = true
    }
    else {
      this.Sh_city_code = cityCode;
    }
  }
  addCity() {
    if (!this.validCityName) {
      var cityAdd: City = new City(1, this.cityName);
      this.api.AddCity(cityAdd).subscribe(
        (response) => {
          this.snackBar.open('העיר נוספה בהצלחה', '', { duration: 2000 });
          this.generalCities();
          this.addCityStatus = false;
          this.Sh_city_code = (response as City).Ci_code;
        },
        (error) => {
          this.snackBar.open('הוספת העיר נכשלה נסה שוב.', '', { duration: 2000 });
        });

    }
  }
  onInputCityName(event: Event) {
    var city = (event.target as HTMLInputElement).value;
    if (city.length <= 20) {
      this.cityName = city
      this.validCityName = false
    }
    else {
      this.validCityName = true
    }
  }
  //פל חניך
  onInputChangeCellPhoneStudent(event: Event) {
    const pel: string = (event.target as HTMLInputElement).value
    if ((pel.length == 10 || pel.length == 9 || pel.length == 0) && this.isNumeric(pel)) {
      this.Sh_cell_phone = pel
      this.validCellPhoneStudent = false;

    }
    else {
      this.validCellPhoneStudent = true;
    }
  }
  //טל בית
  onInputChangePhoneHome(event: Event) {
    const pel: string = (event.target as HTMLInputElement).value
    if ((pel.length == 10 || pel.length == 9 || pel.length == 0) && this.isNumeric(pel)) {
      this.Sh_phone = pel
      this.validPhoneHome = false;
    }
    else {

      this.validPhoneHome = true;
    }
  }
  //שם אב
  onInputChangeNameFather(event: Event) {
    const name: string = (event.target as HTMLInputElement).value
    if (name.length <= 20) {
      this.Pa_name_F = name;
      this.validNameFather = false;

    }
    else {
      this.validNameFather = true;
    }
  }
  //ת.ז אב
  onInputChangeIDFather(event: Event) {
    const id: string = (event.target as HTMLInputElement).value
    if (this.isValidIsraeliIdNumber(id)) {
      this.Pa_ID_F = id
      this.validIDFather = false;
    }
    else {
      this.validIDFather = true;
    }
  }
  //עיסוק
  onInputChangeWorkFather(event: Event) {
    const work: string = (event.target as HTMLInputElement).value
    if (work.length <= 50) {
      this.Pa_work_F = work;
      this.validWorkFather = false;
    }
    else {
      this.validWorkFather = true;
    }
  }
  //פל אב
  onInputChangeCellPhoneFather(event: Event) {
    const pel: string = (event.target as HTMLInputElement).value
    if ((pel.length == 10 || pel.length == 9 || pel.length == 0) && this.isNumeric(pel)) {
      this.Pa_cell_phone_F = pel
      this.validCellPhoneFather = false;
    }
    else {
      this.validCellPhoneFather = true;
    }
  }
  //שם אם
  onInputChangeNameMother(event: Event) {
    const name: string = (event.target as HTMLInputElement).value
    if (name.length <= 20) {
      this.Pa_name_M = name;
      this.validNameMother = false;
    }
    else {
      this.validNameMother = true;
    }
  }
  //ת.ז אם
  onInputChangeIDMother(event: Event) {
    const id: string = (event.target as HTMLInputElement).value
    if (this.isValidIsraeliIdNumber(id)) {
      this.Pa_ID_M = id
      this.validIDMother = false;
    }
    else {
      this.validIDMother = true;
    }
  }
  //עיסוק אם
  onInputChangeWorkMother(event: Event) {
    const work: string = (event.target as HTMLInputElement).value
    if (work.length <= 50) {
      this.Pa_work_M = work;
      this.validWorkMother = false;
    }
    else {
      this.validWorkMother = true;
    }
  }
  //פל אם
  onInputChangeCellPhoneMother(event: Event) {
    const pel: string = (event.target as HTMLInputElement).value
    if ((pel.length == 10 || pel.length == 9 || pel.length == 0) && this.isNumeric(pel)) {
      this.Pa_cell_phone_M = pel
      this.validCellPhoneMother = false;
    }
    else {
      this.validCellPhoneMother = true;
    }
  }

  //מוסד לימודים נוכחי
  onSFS_current_schoolSelected(event: Event) {
    const name = (event.target as HTMLInputElement).value
    this.SFS_current_school = name;

  }
  //שם המוסד
  onInputChangeCurrentSchoolName(event: Event) {
    const name: string = (event.target as HTMLInputElement).value
    if (name.length <= 60) {
      this.SFS_current_school_ame = name;
      this.validCurrentSchoolName = false;
    }
    else {
      this.validCurrentSchoolName = true;
    }
  }
  //שיעור בקליטה
  onInputChangeReceptionClass(event: Event) {
    const name: string = (event.target as HTMLInputElement).value
    if (name.length <= 60) {
      this.SFS_reception_class = name;
      this.validReceptionClass = false;
    }
    else {
      this.validReceptionClass = true;
    }
  }
  //שיעור נוכחי
  onInputChangeCurrentClass(event: Event) {
    const name: string = (event.target as HTMLInputElement).value
    if (name.length <= 60) {
      this.SFS_current_class = name;
      this.validCurrentClass = false;
    }
    else {
      this.validCurrentClass = true;
    }
  }
  //ישיבות קודמות
  onInputChangePreviousInstitutions(event: Event) {
    const name: string = (event.target as HTMLInputElement).value
    if (name.length <= 100) {
      this.SFS_previous_institutions = name;
      this.validPreviousInstitutions = false;
    }
    else {
      this.validPreviousInstitutions = true;
    }
  }
  //תלמוד תורה קודם
  onInputChangePreviousSchool(event: Event) {
    const name: string = (event.target as HTMLInputElement).value
    if (name.length <= 100) {
      this.SFS_previous_school = name;
      this.validPreviousSchool = false;

    }
    else {
      this.validPreviousSchool = true;
    }
  }


  //עדכון
  public async update(): Promise<void> {
    this.loading = true
    //ת.ז 
    if (this.Sh_ID.length != 0) {
      this.sharerUpdate.Sh_ID = this.Sh_ID;
    }
    //שם פרטי
    if (this.Sh_name.length != 0) {
      this.sharerUpdate.Sh_name = this.Sh_name;
    }
    //שם משפחה
    if (this.Sh_Fname.length != 0) {
      this.sharerUpdate.Sh_Fname = this.Sh_Fname;
    }
    //תאריך לידה
    if (this.Sh_birthday.length != 0) {
      this.sharerUpdate.Sh_birthday = this.Sh_birthday;
    }
    //כתובת
    if (this.Sh_address.length != 0) {
      this.sharerUpdate.Sh_address = this.Sh_address;
    }
    //פלאפון
    if (this.Sh_cell_phone.length != 0) {
      this.sharerUpdate.Sh_cell_phone = this.Sh_cell_phone;
    }
    //טלפון
    if (this.Sh_phone.length != 0) {
      this.sharerUpdate.Sh_phone = this.Sh_phone;
    }
    //נוסח תפילה
    if (this.Sh_nusah_tfila.length != 0) {
      this.sharerUpdate.Sh_nusah_tfila = this.Sh_nusah_tfila;
    }
    //אבא ואמא עדכון
    //ת.ז אבא
    if (this.Pa_ID_F.length != 0) {
      if (this.Parent)
        this.Parent.Pa_ID = this.Pa_ID_F;
    }
    if (this.Pa_name_F.length != 0) {
      if (this.Parent)
        this.Parent.Pa_name = this.Pa_name_F;
    }
    if (this.Pa_cell_phone_F.length != 0) {
      if (this.Parent)
        this.Parent.Pa_cell_phone = this.Pa_cell_phone_F;
    }
    if (this.Pa_work_F.length != 0) {
      if (this.Parent)
        this.Parent.Pa_work = this.Pa_work_F;
    }
    if (this.Pa_ID_M.length != 0) {
      if (this.Parent1)
        this.Parent1.Pa_ID = this.Pa_ID_M;
    }
    if (this.Pa_name_M.length != 0) {
      if (this.Parent1)
        this.Parent1.Pa_name = this.Pa_name_M;
    }
    if (this.Pa_cell_phone_M.length != 0) {
      if (this.Parent1)
        this.Parent1.Pa_cell_phone = this.Pa_cell_phone_M;
    }
    if (this.Pa_work_M.length != 0) {
      if (this.Parent1)
        this.Parent1.Pa_work = this.Pa_work_M;
    }
    //עיר
    if (this.Sh_city_code != -1) {
      this.sharerUpdate.Sh_city_code = this.Sh_city_code
    }

    //רשומת לימודים
    if (this.SFS_current_school.length != 0) {
      this.StudiesForSharer.SFS_current_school = this.SFS_current_school;
    }
    if (this.SFS_current_school_ame.length != 0) {
      this.StudiesForSharer.SFS_current_school_ame = this.SFS_current_school_ame;
    }
    if (this.SFS_reception_class.length != 0) {
      this.StudiesForSharer.SFS_reception_class = this.SFS_reception_class;
    }
    if (this.SFS_current_class.length != 0) {
      this.StudiesForSharer.SFS_current_class = this.SFS_current_class;
    }
    if (this.SFS_previous_institutions.length != 0) {
      this.StudiesForSharer.SFS_previous_institutions = this.SFS_previous_institutions;
    }
    if (this.SFS_previous_school.length != 0) {
      this.StudiesForSharer.SFS_previous_school = this.SFS_previous_school;
    }
    if (this.validationUpdate()) {
      //עדכון משתתף
      const dataSharerUpdate = { data: [this.sharerUpdate, this.Parent, this.Parent1, this.StudiesForSharer] }

      await new Promise<void>((resolve, reject) => {
        this.api.UpdateSharer(dataSharerUpdate).subscribe(
          (response) => {
            this.sec = response
            resolve();

          },
          (error) => {
            this.sec = error
            resolve();

          }
        );
      });
      //עדכון משתתף לפרויקט
      if (this.SFP_veshinantem.length == 0) {
        this.SFP_veshinantem = this.sharerForProjectUpdate.SFP_veshinantem
      }
      if (this.SFP_name_school_bein_hazmanim.length == 0) {
        this.SFP_name_school_bein_hazmanim = this.sharerForProjectUpdate.SFP_name_school_bein_hazmanim
      }
      //מדריך
    if (this.selectedGuideCode != -1) {
      this.sharerForProjectUpdate.SFP_code_guide = this.selectedGuideCode
    }
      const sharerForProjectUpdate: SharerForProject = new SharerForProject(this.sharerForProjectUpdate.SFP_code,this.sharerForProjectUpdate.SFP_code_project
        ,this.sharerForProjectUpdate.SFP_code_Sharer,this.sharerForProjectUpdate.SFP_code_guide,this.SFP_name_school_bein_hazmanim,this.SFP_veshinantem,this.sharerUpdate);
      await new Promise<void>((resolve, reject) => {
        this.api.UpdateSharerForProject(sharerForProjectUpdate).subscribe(
          (response) => {
            this.sec = response
            resolve();

          },
          (error) => {
            this.sec = error
            resolve();

          }
        );
      });
      this.loading = false

      this.empty()
      this.popupDisplayOut.emit(false);
    }
    else {
      this.snackBar.open('חסרים פרטים או שחלקם שגויים', 'x', { duration: 3000 });
      this.loading = false

    }

  }
  //מרוקן את כל הינפוטים
  public empty() {
    this.Sh_code = 1
    this.Sh_ID = ""
    this.Sh_gender = 1
    this.Sh_name = ""
    this.Sh_Fname = ""
    this.Sh_birthday = ""
    //הורים
    this.Pa_code_F = 1
    this.Pa_ID_F = ""
    this.Pa_name_F = ""
    this.Pa_cell_phone_F = ""
    this.Pa_work_F = ""

    this.Pa_code_M = 1
    this.Pa_ID_M = ""
    this.Pa_name_M = ""
    this.Pa_cell_phone_M = ""
    this.Pa_work_M = ""

    this.Sh_city_code = -1
    this.Sh_address = ""
    this.Sh_cell_phone = ""
    this.Sh_phone = ""

    //לימודים
    // SFS_student_code=1
    this.SFS_current_school = ""
    this.SFS_current_school_ame = ""
    this.SFS_reception_class = ""
    this.SFS_current_class = ""
    this.SFS_previous_institutions = ""
    this.SFS_previous_school = ""
    this.cb1 = true;
    this.cb2 = false;

    this.selectedGuideCode = -1
    this.SFP_name_school_bein_hazmanim = ""
    this.Sh_nusah_tfila = ""
    this.SFP_veshinantem = ""
    this.validNaneBeinHazmanim = false
    this.validNusahTfila = false
    this.validVeshinantem = false
  }

  //בודקת אם כל הדגלים תקינים
  public validationAdd(): boolean {
    return !this.validNane && !this.validNameF && !this.validId && !this.validCellPhoneStudent && !this.validCellPhoneStudent
      && !this.validBirthday && !this.validAddress && !this.validPhoneHome && !this.validNameFather
      && !this.validIDFather && !this.validWorkFather && !this.validCellPhoneFather && !this.validNameMother && !this.validIDMother
      && !this.validWorkMother && !this.validCellPhoneMother && !this.validCurrentSchoolName
      && !this.validReceptionClass && !this.validCurrentClass && !this.validPreviousInstitutions && !this.validPreviousSchool
     && !this.validNaneBeinHazmanim && !this.validNusahTfila && !this.validVeshinantem && this.Sh_city_code != -1
  }
  //בודקת אם כל הדגלים תקינים
  public validationUpdate(): boolean {
    return !this.validNane && !this.validNameF && !this.validId && !this.validCellPhoneStudent && !this.validCellPhoneStudent
      && !this.validBirthday && !this.validAddress && !this.validPhoneHome && !this.validNameFather
      && !this.validIDFather && !this.validWorkFather && !this.validCellPhoneFather && !this.validNameMother && !this.validIDMother
      && !this.validWorkMother && !this.validCellPhoneMother && !this.validCurrentSchoolName
      && !this.validReceptionClass && !this.validCurrentClass && !this.validPreviousInstitutions && !this.validPreviousSchool
      && !this.validNaneBeinHazmanim && !this.validNusahTfila && !this.validVeshinantem &&
      this.sharerUpdate.Sh_city_code != -1

  }
  //ממירה לתאריך
  date(dateString: string) {
    return new Date(dateString);
  }
  //פרטי משתתף לפרויקט


  //ישיבת בין הזמנים
  onInputChangeNaneBeinHazmanim(event: Event) {
    const name: string = (event.target as HTMLInputElement).value
    if (name.length <= 40) {
      this.SFP_name_school_bein_hazmanim = name;
      this.validNaneBeinHazmanim = false;
    }
    else {
      this.validNaneBeinHazmanim = true;
    }
  }
  //נוסח תפילה
  onInputChangeNusahTfila(event: Event) {
    const name: string = (event.target as HTMLInputElement).value
    if (name.length <= 40) {
      this.Sh_nusah_tfila = name;
      this.validNusahTfila = false;
    }
    else {
      this.validNusahTfila = true;
    }
  }
  //ושננתם
  onInputChangeVeshinantem(event: Event) {
    const name: string = (event.target as HTMLInputElement).value
    if (name.length <= 40) {
      this.SFP_veshinantem = name;
      this.validVeshinantem = false;
    }
    else {
      this.validVeshinantem = true;
    }
  }
  //בחירת מדריך
  onGuideSelected(event: Event) {
    this.selectedGuideCode = Number((event.target as HTMLInputElement).value);
  }
}
