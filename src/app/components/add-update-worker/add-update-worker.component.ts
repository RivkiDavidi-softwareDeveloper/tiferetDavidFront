import { Component, EventEmitter, Input, Output, AfterViewInit, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Worker } from '../../models/worker.class';
import { ApiService } from '../../services/api.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-add-update-worker',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './add-update-worker.component.html',
  styleUrls: ['./add-update-worker.component.scss'],

})
export class AddUpdateWorkerComponent {
  @Input() status: string = 'add';
  @Input() popupDisplayIn: boolean = false;
  @Input() amountWorkers: number = 200;
  @Input() workerUpdate: Worker = new Worker(-1, "", 1, 1, "", "", "", "", "", 1);


  @Output() popupDisplayOut: EventEmitter<boolean> = new EventEmitter()
  password: string = ""
  cb1: boolean = true;
  cb2: boolean = false;
  cb3: boolean = true;
  cb4: boolean = false;
  cb5: boolean = true;
  cb6: boolean = false;

  validNane: boolean = false;
  validNameF: boolean = false;
  validId: boolean = false;
  validPassword: boolean = false;
  validTel: boolean = false;
  validEmail: boolean = false;

  Wo_ID: string = ""
  Wo_gender: number = 1
  Wo_type_worker: number = 1
  Wo_name: string = ""
  Wo_Fname: string = ""
  Wo_password: string = ""
  Wo_cell_phone: string = ""
  Wo_email: string = ""
  Wo_status_code = 1
  sec: any = "2222"


  //קונסטרקטור
  constructor(private api: ApiService, private snackBar: MatSnackBar) {
  }
  //סגירת הפופפ
  public close(): void {
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
  onInputChangeN(event: Event) {
    const name: string = (event.target as HTMLInputElement).value
    if (name.length <= 20) {
      this.Wo_name = name;
      this.validNane = false;
    }
    else {
      this.validNane = true;
    }
  }
  onInputChangeNF(event: Event) {
    const namef: string = (event.target as HTMLInputElement).value
    if (namef.length <= 20) {
      this.Wo_Fname = namef;
      this.validNameF = false;
    }
    else {
      this.validNameF = true;
    }
  }

  onInputChangeID(event: Event) {
    const id: string = (event.target as HTMLInputElement).value
    if (this.isValidIsraeliIdNumber(id)) {
      this.Wo_ID = id;
      this.validId = false;
      if (this.cb3) {
        this.password = id.slice(5, 9)
      }
      else {
        this.password = id.slice(5, 9)
      }
      this.Wo_password = this.password

    }
    else {
      this.validId = true;
    }
  }
  onInputChangePS(event: Event) {
    var str = (event.target as HTMLInputElement).value;
    if (str.length == 4) {
      this.Wo_password = str
      this.validPassword = false
    }
    else {
      this.validPassword = true
    }

  }
  onInputChangePL(event: Event) {
    const pel: string = (event.target as HTMLInputElement).value
    if ((pel.length == 10 || pel.length == 9 || pel.length == 0) && this.isNumeric(pel)) {
      this.Wo_cell_phone = pel;
      this.validTel = false;
    }
    else {
      this.validTel = true;
    }
  }

  onInputChangeEM(event: Event) {
    const email: string = (event.target as HTMLInputElement).value
    if (this.isValidEmail(email)) {
      this.Wo_email = email;
      this.validEmail = false;
    }
    else {
      this.validEmail = true;
    }

  }
  //בודקת את תקינות כל הינפוטים
  validation(): boolean {
    return !this.validPassword && !this.validNane && !this.validNameF && !this.validId && !this.validTel && !this.validEmail && this.Wo_ID.length > 0
      && this.Wo_name.length > 0 && this.Wo_Fname.length > 0 && this.Wo_password.length > 0 && this.Wo_cell_phone.length > 0;
  }
  validation2(): boolean {
    return !this.validPassword && !this.validNane && !this.validNameF && !this.validId && !this.validTel && !this.validEmail;
  }
  //הוספה
  public async add(): Promise<void> {
    if (this.validation()) {
      if (this.cb1) {
        this.Wo_gender = 1;
      }
      else {
        this.Wo_gender = 2
      }
      if (this.cb3) {
        this.Wo_type_worker = 1;
      }
      else {
        this.Wo_type_worker = 2
      }
      if (this.cb5) {
        this.Wo_status_code = 1;
      }
      else {
        this.Wo_status_code = 2
      }
      const workerAdd: Worker = new Worker(this.amountWorkers + 1, this.Wo_ID, this.Wo_gender, this.Wo_type_worker,
        this.Wo_name, this.Wo_Fname, this.Wo_password, this.Wo_cell_phone, this.Wo_email, this.Wo_status_code);
      console.log(workerAdd)
      await new Promise<void>((resolve, reject) => {

        this.api.AddWorker(workerAdd).subscribe(
          (response) => {
            this.sec = response
            resolve(); // מסמן שהפעולה הושלמה

          },
          (error) => {
            this.sec = error
            resolve(); // מסמן שהפעולה הושלמה

          });
      });
      this.empty()
      this.popupDisplayOut.emit(false);
    }
    else {
      this.snackBar.open('!הפרטים שגויים', 'x', { duration: 5000 });
    }
  }
  //עדכון

  public async update(): Promise<void> {
    if (this.validation2()) {


      if (this.Wo_ID.length == 0) {
        this.Wo_ID = this.workerUpdate.Wo_ID
      }
      if (this.Wo_name.length == 0) {
        this.Wo_name = this.workerUpdate.Wo_name
      }
      if (this.Wo_Fname.length == 0) {
        this.Wo_Fname = this.workerUpdate.Wo_Fname
      }
      if (this.Wo_password.length == 0) {
        this.Wo_password = this.workerUpdate.Wo_password
      }
      if (this.Wo_cell_phone.length == 0) {
        this.Wo_cell_phone = this.workerUpdate.Wo_cell_phone
      }
      if (this.Wo_email.length == 0) {
        this.Wo_email = this.workerUpdate.Wo_email
      }
    
      const workerUpdate: Worker = new Worker(this.workerUpdate.Wo_code, this.Wo_ID, this.workerUpdate.Wo_gender, this.workerUpdate.Wo_type_worker,
        this.Wo_name, this.Wo_Fname, this.Wo_password, this.Wo_cell_phone, this.Wo_email, this.workerUpdate.Wo_status_code);
      await new Promise<void>((resolve, reject) => {

        this.api.UpdateWorker(workerUpdate).subscribe(
          (response) => {
            this.sec = response
            resolve(); // מסמן שהפעולה הושלמה

          },
          (error) => {
            this.sec = error
            resolve(); // מסמן שהפעולה הושלמה

          });

      });
      this.empty()
      this.popupDisplayOut.emit(false);
    }
    else {
      this.snackBar.open('!הפרטים שגויים', 'x', { duration: 5000 });
    }


  }
  public empty() {
    this.Wo_ID = ""
    this.Wo_gender = 1
    this.Wo_type_worker = 1
    this.Wo_name = ""
    this.Wo_Fname = ""
    this.Wo_password = ""
    this.Wo_cell_phone = ""
    this.Wo_email = ""
    this.cb1 = true;
    this.cb2 = false;
    this.cb3 = true;
    this.cb4 = false;
    this.cb5 = true;
    this.cb6 = false;
    this.password = ""
  }
}
