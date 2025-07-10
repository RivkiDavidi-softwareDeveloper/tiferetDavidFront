
import { Component, EventEmitter, Input, Output, AfterViewInit, OnInit, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { CommonModule } from '@angular/common';
import { Worker } from '../../models/worker.class';
import { ApiService } from '../../services/api.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Student } from '../../models/student.class';
import { Parentt } from '../../models/parent.class';
import { StudiesForStudent } from '../../models/studiesForStudent.class';
import { combineLatest } from 'rxjs';
import { delay } from 'rxjs/operators';
import { City } from '../../models/city.class';
import { TypeRisk } from '../../models/TypeRisk.enum';
import { DifficultyStudent } from '../../models/difficultyStudent.class';
import { Community } from '../../models/community.class';
import { Synagogue } from '../../models/synagogue.class';
import { LoadingSpinnerComponent } from "../loading-spinner/loading-spinner.component";
import { Sharer } from '../../models/sharer.class';
import { SharerForProject } from '../../models/sharerForProject.class';
import { StudentForProject } from '../../models/studentForProject.class';
import { isBuffer } from 'util';

@Component({
  selector: 'app-add-update-student',
  standalone: true,
  imports: [CommonModule, LoadingSpinnerComponent],
  templateUrl: './add-update-student.component.html',
  styleUrl: './add-update-student.component.scss'
})
export class AddUpdateStudentComponent implements OnInit, OnDestroy {
  //סינכרון נתונים בין לקוחות
  socket: Socket | undefined;
  ngOnDestroy(): void {
    if (this.socket)
      this.socket.disconnect();
  }
  connectSocket(): void {
    /*   this.socket = io(this.api.urlBasisSocket, {
        transports: ["polling"]
      });    this.socket.on("workers-updated", () => {
      this.generalWorkers();
      }); */

  }
  @Input() codeWorkerLogin = 0;
  @Input() status: string = 'add';
  @Input() status2: string = 'add';
  @Input() popupDisplayIn: boolean = false;
  //ערים
  lisOfCities: Array<City> = []
  //קשיים לתלמיד
  listOfDiffSelected: Array<DifficultyStudent> = []
  //עובדים
  listOfWorkers: Array<Worker> = []
  genderF = 1
  //רשימת קהילות
  listOfCommunities: Array<Community> = []
  //רשימת בתי כנסת
  listOfsynagogueis: Array<Synagogue> = []
  codeCommonity = -1
  //לעדכון
  @Input() studentUpdate: Student = new Student(111, "4444444444", 1, "", "", "", "", 1, 1, 1, "", "", "", "", -1, 1, 1, "", "", "", 1, "", 1, 1, 1, "", "", "")
  @Input() Parent: Parentt = new Parentt(111, "", "", "", "")
  @Input() Parent1: Parentt = new Parentt(111, "", "", "", "")
  @Input() DifficultyStudent: Array<DifficultyStudent> = []
  @Input() Worker: Worker = new Worker(111, "", 1, 1, "", "", "", "", "",1)
  @Input() StudiesForStudent: StudiesForStudent = new StudiesForStudent(111, 1, "", "", "", "", "", "")
  //לרישום מששתף כחניך
  @Input() studentForProject: StudentForProject = new StudentForProject(-1, 1, 1, 1, "", "", this.studentUpdate)
  @Input() sharer: Sharer = new Sharer(-1, "", 1, "", "", "", 1, 1, 1, "", "", "", "")
  @Output() popupDisplayOut: EventEmitter<boolean> = new EventEmitter()
  @Input() cb1: boolean = true;
  @Input() cb2: boolean = false;
  cb3: boolean = true;
  cb4: boolean = false;
  cb5: boolean = false;
  detail: boolean = false;
  //אנימציה
  loading = false
  //תכונות להוספה
  St_code: number = 1
  St_ID: string = ""
  St_gender: number = 1
  St_name: string = ""
  St_Fname: string = ""
  St_image: string = ""
  St_birthday: string = ""
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

  St_city_code: any = -1
  St_code_synagogue: any = -1
  St_address: string = ""
  St_cell_phone: string = ""
  St_phone: string = ""
  St_email: string = ""
  St_worker_code: any = -1
  St_activity_status: number = 1
  St_risk_code: any = -1
  St_description_reception_status: string = ""
  St_contact: string = ""
  St_contact_phone: string = ""
  St_socioeconomic_status: number = 10
  St_requester: string = ""
  requester = ""
  St_code_frequency: any = -1
  St_amount_frequency = 0
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
  //שם קהילה להוספה
  addCommunityStatus = false
  communityName = ""
  //שם בית כנסת להוספה
  addSynagugaStatus = false
  synagogueName = ""
  ///דגלים לבדיקות תקינות
  validNane: boolean = false;
  validNameF: boolean = false;
  validId: boolean = false;
  validCellPhoneStudent: boolean = false;
  validBirthday: boolean = false;
  validAddress: boolean = false
  validPhoneHome: boolean = false
  validEmail: boolean = false;
  validNameFather: boolean = false
  validIDFather: boolean = false
  validWorkFather: boolean = false
  validCellPhoneFather: boolean = false
  validNameMother: boolean = false
  validIDMother: boolean = false
  validWorkMother: boolean = false
  validCellPhoneMother: boolean = false
  validStatusSocio: boolean = false;
  validCurrentSchoolName: boolean = false;
  validReceptionClass: boolean = false;
  validCurrentClass: boolean = false
  validPreviousInstitutions: boolean = false
  validPreviousSchool: boolean = false;
  validContact: boolean = false;
  validContactPhone: boolean = false;
  validDescriptionReceptionStatus: boolean = false
  validRequester = false
  validCityName = false
  validSynagugaName = false
  validCommunityName = false

  sec: any = "sec"
  secUpload = "nonnnn"

  @Input() selectedImage: string = "";
  image: File | undefined

  imageBlobURL: string = "";

  //קונסטרקטור
  constructor(private api: ApiService, private snackBar: MatSnackBar, private cdRef: ChangeDetectorRef) { }

  ngOnInit(): void {

    this.generalCities();
    this.generalWorkers();
    this.generalCommunities()
    this.generalSynagogueis()
    this.connectSocket()
  }
  //רשימת עובדים
  public generalWorkers(): void {
    if (this.cb1) {
      this.genderF = 1
    }
    else {
      this.genderF = 2

    }
    // this.api.getWorkers(1, this.genderF, 0, 0).subscribe(Date => {

    this.api.FindWorker("", 1, this.genderF, 0, 0).subscribe(Date => {
      this.listOfWorkers = []
      this.listOfWorkers.push(...Date);
      this.cdRef.detectChanges();
    })
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
  //בחירת קהילה
  selectedCommunity(St_code_synagogue: number |undefined, Com_code: number) {

    return this.listOfsynagogueis.find(s => s.Sy_code == St_code_synagogue)?.Sy_code_Community == Com_code
  }
  //קשיים
  ifCheck(code: number) {
    if (this.DifficultyStudent.find(d => d.DS_diffculty_code == code) != null) {
      return true;
    }
    return false;
  }
  //סגירת הפופפ
  public close(): void {
    this.empty()
    this.popupDisplayOut.emit(false)
  }
  //סגירת הפופפ
  public async closeAddFromSharer(): Promise<void> {
    //מחיקת תלמיד מחניך לפרויקט
    await new Promise<void>((resolve, reject) => {

      this.api.deleteStudentForProject(this.studentForProject.SFP_code).subscribe(
        (message: any) => {
          resolve();
        },
        (error: any) => {
          resolve();
        });
    });
    //הוספה משתתף לפרויקט 
    const sharerForProject: SharerForProject = new SharerForProject(1, this.studentForProject.SFP_code_project, this.sharer.Sh_code, this.studentForProject.SFP_code_guide, this.studentForProject.SFP_name_school_bein_hazmanim, this.studentForProject.SFP_veshinantem, this.sharer)
    await new Promise<void>((resolve, reject) => {

      this.api.AddSharerForProject(sharerForProject).subscribe(
        (response) => {
          resolve();

        },
        (error) => {
          resolve();

        });
    });
    //מחיקת התלמיד
    await new Promise<void>((resolve, reject) => {

      this.api.DeleteStudent(this.studentUpdate.St_code).subscribe(
        (response) => {
          resolve();
        },
        (error) => {
          resolve();

        }
      );
    });
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
      this.St_ID = id
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
      this.St_name = name;
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
      this.St_Fname = namef
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
      this.St_birthday = date
      this.validBirthday = false;

    }
    else {
      this.validBirthday = true;
    }
    this.studentUpdate.St_birthday = date

  }
  //כתובת
  onInputChangeAddress(event: Event) {
    const address: string = (event.target as HTMLInputElement).value
    if (address.length <= 40) {
      this.St_address = address
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
      this.St_city_code = cityCode;
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
          this.St_city_code = (response as City).Ci_code;
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
  //קהילה
  onCommunitySelected(event: Event) {
    this.St_code_synagogue = -1

    const Code = Number((event.target as HTMLInputElement).value);
    if (Code == (-2)) {
      this.addCommunityStatus = true
    }
    else {
      this.codeCommonity = Code;
      this.generalSynagogueis();
    }

  }
  onInputCommunityName(event: Event) {
    var str = (event.target as HTMLInputElement).value;
    if (str.length <= 20) {
      this.communityName = str
      this.validCommunityName = false
    }
    else {
      this.validCommunityName = true
    }
  }
  //הוספת קהילה
  addCommunity() {
    if (!this.validCommunityName) {
      var communityAdd: Community = new Community(1, this.communityName)
      this.api.AddCommunity(communityAdd).subscribe(
        (response) => {
          this.snackBar.open('הקהילה נוספה בהצלחה', '', { duration: 2000 });
          this.generalCommunities();
          this.addCommunityStatus = false;
          this.codeCommonity = (response as Community).Com_code;
          this.generalSynagogueis();
        },
        (error) => {
          this.snackBar.open('הוספת הקהילה נכשלה נסה שוב.', '', { duration: 2000 });
        });

    }
  }
  //בית כנסת
  onSynagogueSelected(event: Event) {
    const code = Number((event.target as HTMLInputElement).value);
    if (code == (-2)) {
      this.addSynagugaStatus = true
    }
    else {
      this.St_code_synagogue = code
    }
  }
  onInputSynagogueName(event: Event) {
    var str = (event.target as HTMLInputElement).value;
    if (str.length <= 20) {
      this.synagogueName = str
      this.validSynagugaName = false
    }
    else {
      this.validSynagugaName = true
    }
  }
  //הוספת בית כנסת
  addSynagogue() {
    if (!this.validSynagugaName) {
      var synagogueAdd: Synagogue = new Synagogue(1, this.synagogueName, this.codeCommonity)
      this.api.AddSynagogue(synagogueAdd).subscribe(
        (response) => {
          this.snackBar.open('הבית כנסת נוסף בהצלחה', '', { duration: 2000 });
          this.generalSynagogueis();
          this.addSynagugaStatus = false;
          this.St_code_synagogue = (response as Synagogue).Sy_code;
        },
        (error) => {
          this.snackBar.open('הוספת הבית כנסת נכשלה נסה שוב.', '', { duration: 2000 });
        });

    }
  }
  //פל חניך
  onInputChangeCellPhoneStudent(event: Event) {
    const pel: string = (event.target as HTMLInputElement).value
    if ((pel.length == 10 || pel.length == 9 || pel.length == 0) && this.isNumeric(pel)) {
      this.St_cell_phone = pel
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
      this.St_phone = pel
      this.validPhoneHome = false;
    }
    else {

      this.validPhoneHome = true;
    }
  }
  //מייל
  onInputChangeEmail(event: Event) {
    const email: string = (event.target as HTMLInputElement).value
    if (this.isValidEmail(email)) {
      this.St_email = email
      this.validEmail = false;
    }
    else {
      this.validEmail = true;
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
  // מצס סוציאקנומי
  onInputChangeStatusSocio(event: Event) {
    const status: string = (event.target as HTMLInputElement).value
    this.St_socioeconomic_status = Number(status)
    this.studentUpdate.St_socioeconomic_status = Number(status)
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
  //איש צוות מקושר
  onInputChangeContact(event: Event) {
    const name: string = (event.target as HTMLInputElement).value
    if (name.length <= 40) {
      this.St_contact = name;
      this.validContact = false;
    }
    else {
      this.validContact = true;
    }
  }
  //פל איש צוות
  onInputChangeContactPhone(event: Event) {
    const pel: string = (event.target as HTMLInputElement).value
    if ((pel.length == 10 || pel.length == 9 || pel.length == 0) && this.isNumeric(pel)) {
      this.St_contact_phone = pel
      this.validContactPhone = false;
    }
    else {
      this.validContactPhone = true;
    }
  }
  //סוג תדירות
  onCodeFrequencySelected(event: Event) {
    const freq = Number((event.target as HTMLInputElement).value);
    this.St_code_frequency = freq
  }
  //כמות תדירות
  onInputAmountFrequency(event: Event) {
    this.St_amount_frequency = Number((event.target as HTMLInputElement).value)

  }
  //מצב פעילות
  //מצב סיכון
  onRiskSelected(event: Event) {
    const status = (event.target as HTMLInputElement).value;
    if (status === "בחר") {
      this.St_risk_code = -1
    }
    else {
      this.St_risk_code = TypeRisk[status as keyof typeof TypeRisk];
    }
  }
  //תיאור מצב קליטה
  onInputChangeDescriptionReceptionStatus(event: Event) {
    const describe: string = (event.target as HTMLInputElement).value
    if (describe.length <= 200) {
      this.St_description_reception_status = describe
      this.validDescriptionReceptionStatus = false;
    }
    else {
      this.validDescriptionReceptionStatus = true;
    }
  }

  //פעיל ישיר
  onWorkerSelected(event: Event) {
    this.St_worker_code = Number((event.target as HTMLInputElement).value);
  }
  //פונה
  onSt_requesterSelected(event: Event) {
    const req = (event.target as HTMLInputElement).value;
    this.requester = req;
    if (req === "צוות חינוכי" || req == "אחר") {
      this.detail = true;
    }
    else {
      this.detail = false;
      this.St_requester = this.requester;
    }
  }
  onInputChangeRequester(event: Event) {
    const name: string = (event.target as HTMLInputElement).value
    if (name.length <= 15) {
      this.St_requester = this.requester + ": " + name;
      this.validRequester = false;
    }
    else {
      this.validRequester = true;
    }
  }
  //מחזיר את החלק הראשון בפונה 
  Requester1() {
    if (this.studentUpdate.St_requester) {
      const parts = this.studentUpdate.St_requester.split(':');
      return parts[0];
    }
    return ""
  }
  //מחזיר את החלק השני בפונה
  Requester2() {
    if (this.studentUpdate.St_requester) {
      const parts = this.studentUpdate.St_requester.split(':');
      return parts[1];
    }
    return ""
  }
  //רשימת קשיים
  onSelestDifficulity(event: Event) {
    const code = Number((event.target as HTMLInputElement).value)
    if (this.status === "update") {
      if (this.DifficultyStudent.find(l => l.DS_diffculty_code == code)) {
        this.DifficultyStudent.forEach((d, index) => {
          if (d.DS_diffculty_code == code) {
            this.DifficultyStudent.splice(index, 1);
          }
        });
      }
      else {
        var diff: DifficultyStudent = new DifficultyStudent(1, code, 1)
        this.DifficultyStudent.push(diff);
      }
    }
    else {
      if (this.listOfDiffSelected.find(l => l.DS_diffculty_code == code) != null) {
        this.listOfDiffSelected.forEach((d, index) => {
          if (d.DS_diffculty_code == code) {
            this.listOfDiffSelected.splice(index, 1);
          }
        });
      }
      else {
        var diff: DifficultyStudent = new DifficultyStudent(1, code, 1)
        this.listOfDiffSelected.push(diff);
      }
    }
  }
  //הוספה
  public async add(): Promise<void> {
    this.loading = true
    if (this.validationAdd()) {
      if (this.cb1) {
        this.St_gender = 1;
      }
      else {
        this.St_gender = 2
      }
      if (this.cb3) {
        this.St_activity_status = 1;
      }
      else {
        if (this.cb4) {
          this.St_activity_status = 2
        }
        else {
          this.St_activity_status = 3
        }
      }
      if (this.St_city_code == -1) {
        this.St_city_code = null;
      }
      if (this.St_worker_code == -1) {
        this.St_worker_code = null
      }
      if (this.St_risk_code == -1) {
        this.St_risk_code = null
      }
      if (this.St_code_frequency == -1) {
        this.St_code_frequency = null
      }
      if (this.codeWorkerLogin != 0) {
        this.St_worker_code = this.codeWorkerLogin
      }
      if (this.St_code_synagogue == -1) {
        this.St_code_synagogue = null
      }
      if (this.image) {
        this.St_image = "yes";
      }
      const parentFAdd = new Parentt(1, this.Pa_ID_F, this.Pa_name_F, this.Pa_cell_phone_F, this.Pa_work_F);
      const parentMAdd = new Parentt(1, this.Pa_ID_M, this.Pa_name_M, this.Pa_cell_phone_M, this.Pa_work_M);
      console.log(parentFAdd.Pa_name)
      const listOfDiffSelectedAdd = this.listOfDiffSelected;
      const studiesAdd = new StudiesForStudent(1, 1, this.SFS_current_school, this.SFS_current_school_ame, this.SFS_reception_class,
        this.SFS_current_class, this.SFS_previous_institutions, this.SFS_previous_school);
      const studentAdd: Student = new Student(1, this.St_ID, this.St_gender, this.St_name, this.St_Fname, this.St_image,
        this.St_birthday, this.Pa_code_F, this.Pa_code_M, this.St_city_code, this.St_address, this.St_cell_phone, this.St_phone,
        this.St_email, this.St_worker_code, this.St_activity_status, this.St_risk_code, this.St_description_reception_status,
        this.St_contact, this.St_contact_phone, this.St_socioeconomic_status, this.St_requester, this.St_code_synagogue,
        this.St_code_frequency, this.St_amount_frequency, "", "", "");
      const dataStudentAdd = { data: [studentAdd, parentFAdd, parentMAdd, listOfDiffSelectedAdd, studiesAdd] }

      //הוספת חניך
      await new Promise<void>((resolve, reject) => {

        this.api.AddStudent(dataStudentAdd).subscribe(
          (response) => {
            this.snackBar.open('החניך נוסף בהצלחה', 'x', { duration: 3000 });

            this.St_code = (response as Student).St_code
            if (this.image) {
              const formData = new FormData();
              formData.append("image", this.image, "student" + String(this.St_code));

              this.api.uploadStudentImage(formData).subscribe({
                next: () => console.log("תמונה הועלתה בהצלחה"),
                error: err => console.error("שגיאה בהעלאת תמונה", err)
              });

            }
            resolve();
            this.loading = false

          },
          (error) => {
            this.snackBar.open('שגיאה בהוספת חניך', 'x', { duration: 3000 });

            resolve();
            this.loading = false

          });
      });
      this.empty()
      this.popupDisplayOut.emit(false);
    }
    else {
      this.snackBar.open('חסרים פרטים או שחלקם שגויים', 'x', { duration: 3000 });
      this.loading = false

    }

  }
  //עדכון
  public async update(): Promise<void> {
    this.loading = true
    //ת.ז 
    if (this.St_ID.length != 0) {
      this.studentUpdate.St_ID = this.St_ID;
    }
    //שם פרטי
    if (this.St_name.length != 0) {
      this.studentUpdate.St_name = this.St_name;
    }
    //שם משפחה
    if (this.St_Fname.length != 0) {
      this.studentUpdate.St_Fname = this.St_Fname;
    }
    //תמונה

    if (this.image) {
      this.studentUpdate.St_image = "yes";
    }
    else {
      this.studentUpdate.St_image = this.St_image;

    }
    //תאריך לידה
    if (this.St_birthday.length != 0) {
      this.studentUpdate.St_birthday = this.St_birthday;
    }
    //כתובת
    if (this.St_address.length != 0) {
      this.studentUpdate.St_address = this.St_address;
    }
    //פלאפון
    if (this.St_cell_phone.length != 0) {
      this.studentUpdate.St_cell_phone = this.St_cell_phone;
    }
    //טלפון
    if (this.St_phone.length != 0) {
      this.studentUpdate.St_phone = this.St_phone;
    }
    //מייל
    if (this.St_email.length != 0) {
      this.studentUpdate.St_email = this.St_email;
    }
    //תיאור
    if (this.St_description_reception_status.length != 0) {
      this.studentUpdate.St_description_reception_status = this.St_description_reception_status;
    }
    //איש קשר
    if (this.St_contact.length != 0) {
      this.studentUpdate.St_contact = this.St_contact;
    }
    //פל איש קשר
    if (this.St_contact_phone.length != 0) {
      this.studentUpdate.St_contact_phone = this.St_contact_phone;
    }
    //מבקש
    if (this.St_requester.length != 0) {
      this.studentUpdate.St_requester = this.St_requester;
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
    if (this.St_city_code != -1) {
      this.studentUpdate.St_city_code = this.St_city_code
    }
    //חונך
    if (this.St_worker_code != -1) {
      this.studentUpdate.St_worker_code = this.St_worker_code
    }
    //סיכון
    if (this.St_risk_code != -1) {
      this.studentUpdate.St_risk_code = this.St_risk_code
    }
    //סוג תדירות
    if (this.St_code_frequency != -1) {
      this.studentUpdate.St_code_frequency = this.St_code_frequency
    }
    //כמות תדירות
    if (this.St_amount_frequency != 0) {
      this.studentUpdate.St_amount_frequency = this.St_amount_frequency
    }
    //סוציואקנומי

    //קהילה
    //בית כנסת
    if (this.St_code_synagogue != -1) {
      this.studentUpdate.St_code_synagogue = this.St_code_synagogue
    }
    //רשומת לימודים
    if (this.SFS_current_school.length != 0) {
      this.StudiesForStudent.SFS_current_school = this.SFS_current_school;
    }
    if (this.SFS_current_school_ame.length != 0) {
      this.StudiesForStudent.SFS_current_school_ame = this.SFS_current_school_ame;
    }
    if (this.SFS_reception_class.length != 0) {
      this.StudiesForStudent.SFS_reception_class = this.SFS_reception_class;
    }
    if (this.SFS_current_class.length != 0) {
      this.StudiesForStudent.SFS_current_class = this.SFS_current_class;
    }
    if (this.SFS_previous_institutions.length != 0) {
      this.StudiesForStudent.SFS_previous_institutions = this.SFS_previous_institutions;
    }
    if (this.SFS_previous_school.length != 0) {
      this.StudiesForStudent.SFS_previous_school = this.SFS_previous_school;
    }
    if (this.validationUpdate()) {
      //עדכון תלמיד
      const dataStudentUpdate = { data: [this.studentUpdate, this.Parent, this.Parent1, this.listOfDiffSelected, this.StudiesForStudent] }

      await new Promise<void>((resolve, reject) => {
        this.api.UpdateStudent(dataStudentUpdate).subscribe(
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
      //עדכון תמונה
      if (this.image) {
        const formData = new FormData();
        formData.append("image", this.image, "student" + String(this.studentUpdate.St_code));
        await new Promise<void>((resolve, reject) => {
          this.api.uploadStudentImage(formData).subscribe({
            next: () => {
              console.log("תמונה הועלתה בהצלחה"); resolve();
            },
            error: err => {
              console.error("שגיאה בהעלאת תמונה", err); resolve();
            }
          });
        }
        );
      }
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
    this.St_code = 1
    this.St_ID = ""
    this.St_gender = 1
    this.St_name = ""
    this.St_Fname = ""
    this.St_image = ""
    this.St_birthday = ""
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

    this.St_city_code = -1
    this.St_address = ""
    this.St_cell_phone = ""
    this.St_phone = ""
    this.St_email = ""
    this.St_worker_code = -1
    this.St_activity_status = 1
    this.St_risk_code = -1
    this.St_description_reception_status = ""
    this.St_contact = ""
    this.St_contact_phone = ""
    this.St_socioeconomic_status = 10
    this.St_requester = ""
    this.St_code_frequency = -1
    this.St_amount_frequency = 0
    this.St_code_synagogue = -1
    this.codeCommonity = -1
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
    this.cb3 = true;
    this.cb4 = false;
    this.cb5 = false
    this.selectedImage = "";
  }

  //בודקת אם כל הדגלים תקינים
  public validationAdd(): boolean {
//ביטול שדות חובה לבדיקת הרצה בלבד!!!!!
if(this.St_city_code == -1){
this.St_city_code=undefined
}
if(this.St_code_synagogue == -1){
this.St_code_synagogue=undefined
}
if(this.St_risk_code == -1){
this.St_risk_code=undefined
}
if(this.St_code_frequency == -1){
this.St_code_frequency=undefined
}


    return !this.validNane && !this.validNameF && !this.validId && !this.validCellPhoneStudent && !this.validCellPhoneStudent
      && !this.validBirthday && !this.validAddress && !this.validPhoneHome && !this.validEmail && !this.validNameFather
      && !this.validIDFather && !this.validWorkFather && !this.validCellPhoneFather && !this.validNameMother && !this.validIDMother
      && !this.validWorkMother && !this.validCellPhoneMother && !this.validStatusSocio && !this.validCurrentSchoolName
      && !this.validReceptionClass && !this.validCurrentClass && !this.validPreviousInstitutions && !this.validPreviousSchool
      && !this.validContact && !this.validContactPhone && !this.validDescriptionReceptionStatus && !this.validRequester &&
      this.St_city_code != -1 && this.St_code_synagogue != -1 && (this.St_worker_code != -1 || this.codeWorkerLogin != 0) && this.St_risk_code != -1 && this.St_code_frequency != -1;
  }
  //בודקת אם כל הדגלים תקינים
  public validationUpdate(): boolean {
    return !this.validNane && !this.validNameF && !this.validId && !this.validCellPhoneStudent && !this.validCellPhoneStudent
      && !this.validBirthday && !this.validAddress && !this.validPhoneHome && !this.validEmail && !this.validNameFather
      && !this.validIDFather && !this.validWorkFather && !this.validCellPhoneFather && !this.validNameMother && !this.validIDMother
      && !this.validWorkMother && !this.validCellPhoneMother && !this.validStatusSocio && !this.validCurrentSchoolName
      && !this.validReceptionClass && !this.validCurrentClass && !this.validPreviousInstitutions && !this.validPreviousSchool
      && !this.validContact && !this.validContactPhone && !this.validDescriptionReceptionStatus && !this.validRequester &&
      this.studentUpdate.St_city_code != -1 && this.studentUpdate.St_code_synagogue != -1 && this.studentUpdate.St_worker_code != -1 &&
      this.studentUpdate.St_risk_code != -1 && this.studentUpdate.St_code_frequency != -1;
  }
  //ממירה לתאריך
  date(dateString: string) {
    return new Date(dateString);
  }
}



/*
קוד ישן שליחה תמונה ל-c#  this.api.uploadImageStudent(formData, "image" + ).subscribe(
   (response) => {
     console.log('Image uploaded successfully:', response);
     resolve();
   },
   (error) => {
     console.error('Error uploading image:', error);
     resolve();
   }
 ); */

