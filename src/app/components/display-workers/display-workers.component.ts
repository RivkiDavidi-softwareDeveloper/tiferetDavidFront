import { ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AddUpdateWorkerComponent } from "../add-update-worker/add-update-worker.component";
import { ApiService } from '../../services/api.service';
import { Worker } from '../../models/worker.class';
import { TypeWorker } from '../../models/TypeWorker.enum';
import { TypeGender } from '../../models/TypeGender.enum';
import { MatSnackBar } from '@angular/material/snack-bar';
import { interval } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';
@Component({
  selector: 'app-display-workers',
  standalone: true,
  templateUrl: './display-workers.component.html',
  styleUrls: ['./display-workers.component.scss'],
  imports: [CommonModule, AddUpdateWorkerComponent]
})
export class DisplayWorkersComponent implements OnInit {

  click1: boolean = true; click2: boolean = false; click3: boolean = false;
  click4: boolean = true; click5: boolean = false; click6: boolean = false;
  clickO1: boolean = true; clickO2: boolean = false;
  locking: boolean = false;

  sAddWorker: boolean = false;
  sUpdateWorker: boolean = false;
  updateWorker: Worker = new Worker(57, "", 1, 1, "", "", "", "", "");

  comboBox1: boolean = false
  comboBox2: boolean = false
  comboBox3: boolean = false

  genderO: number = 1
  genderF: number = 0
  typeWO: number = 0
  typeWF: number = 0
  order = 'מגדר'
  filterGG = 'הכל'
  filterTT = 'הכל'
  amount = 0;
  amountAll = 0;
  sec: string = ""
  listOfWorkers: Array<Worker> = []
 // searchText: string = "null";
  searchText: string = "";

  constructor(private api: ApiService, private cdRef: ChangeDetectorRef, private snackBar: MatSnackBar, public dialog: MatDialog) { }
  ngOnInit(): void {
    this.general();
  }

  //חיפוש
  onInputChange(event: Event) {
    this.searchText = (event.target as HTMLInputElement).value;

    this.api.FindWorker(this.searchText, this.genderO, this.genderF, this.typeWO, this.typeWF).subscribe(Date => {
      this.listOfWorkers = []
      this.listOfWorkers.push(...Date)
      this.amount=this.listOfWorkers.length

    })

    if (this.searchText === "") {
      this.searchText = ""
      this.general();
    }

  }


  //סגירת הפופפ
  closeP(display: boolean) {
    this.sAddWorker = display;
    this.sUpdateWorker = display;
    this.general();
  }


  //רשימה של עובדים
  public general(): void {
   // this.api.getWorkers(this.genderO, this.genderF, this.typeWO, this.typeWF).subscribe(Date => {
      this.api.FindWorker(this.searchText,this.genderO, this.genderF, this.typeWO, this.typeWF).subscribe(Date => {

      this.listOfWorkers = []
      this.listOfWorkers.push(...Date);
      this.amount=this.listOfWorkers.length
      this.cdRef.detectChanges();
    })

  }
  //מחזיר את סוג העובד
  public typeW(num: number): string {
    return TypeWorker[num]
  }

  //מדפיס
  public print(): void {
    window.print();

  }
  //מוחק עובד
  public delete(code: number,name:string) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '350px',
      data: { title: 'אישור מחיקה', message: 'במחיקת פעיל/ חונך נמחקת כל הסטוריית הפעילות שלו וכל הקבצים המשויכים אליו. \n האם אתה בטוח שברצונך למחוק את הפעיל ' + name + '?' }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
     /*    // קוד לביצוע מחיקה
        this.api.DeleteWorker(code).subscribe(Date => {
          if (Date == 3) {
            this.snackBar.open('לא ניתן למחוק פעיל זה מכיון שמשויכים אליו חניכים/ הודעות ', 'x', { duration: 3000 });
          }
          else {
            this.snackBar.open('!העובד נמחק בהצלחה', 'x', { duration: 3000 });
            this.general();
          }
        }) */
      } else {}
    });
  }
  //עורך עובד
  edit(w: Worker): void {
    this.updateWorker.Wo_code = w.Wo_code
    this.updateWorker.Wo_ID = w.Wo_ID
    this.updateWorker.Wo_gender = w.Wo_gender
    this.updateWorker.Wo_type_worker = w.Wo_type_worker
    this.updateWorker.Wo_name = w.Wo_name
    this.updateWorker.Wo_Fname = w.Wo_Fname
    this.updateWorker.Wo_password = w.Wo_password
    this.updateWorker.Wo_cell_phone = w.Wo_cell_phone
    this.updateWorker.Wo_email = w.Wo_email
    this.sUpdateWorker=true
  }
  //חסימת פעיל
  lock(w: Worker) {
    w.Wo_password = w.Wo_password + String(Math.floor(Math.random() * (999999 - 111111 + 1)) + 111111)
    this.api.UpdateWorker(w).subscribe(
      (response) => {
        this.sec = response
      },
      (error) => {
        this.sec = error
      });
    this.locking = true;
  }
  //שחרור פעיל
  unlock(w: Worker) {
    w.Wo_password = w.Wo_password + "987"
    w.Wo_password = w.Wo_password.substring(0, 4);

    this.api.UpdateWorker(w).subscribe(
      (response) => {
        this.sec = response
      },
      (error) => {
        this.sec = error
      });
    this.locking = false;

  }
  //בדיקה האם פעיל חסום
  ifLocking(password: string): boolean {
    if (password.length == 10) {
      return true;
    }
    return false;
  }
  //סינון מצב פעילות
  onActivityStatusSelected(event: Event) {
    this.typeWF = Number((event.target as HTMLInputElement).value);
    this.general()
  }
  //סינון מגדר
  onGenderSelected(event: Event) {
    this.genderF = Number((event.target as HTMLInputElement).value);
    this.general()
  }
  // מיון
  onOrderSelected(event: Event) {
    const status = (event.target as HTMLInputElement).value;
    if (status === "מגדר") {
      this.genderO = 1;
      this.typeWO = 0;
    }
    else {
      this.genderO = 0;
      this.typeWO = 1
    }
    this.general();
  }
  //שם מיון
  nameOrder() {
    if (this.genderO == 0) {
      return "סוג עובד"
    }
    return "מגדר"
  }
  //שם סינון
  nameFilterG(codeG: number) {
    if (codeG == 0) {
      return "הכל"
    }
    if (codeG == 1) {
      return "בנים"
    }
    return "בנות"
  }
  nameFilterTW(codeTW: number,codeG: number) {
    if (codeTW == 0) {
      return "הכל"
    }
    if (codeTW == 1 ) {
      if (codeG == 0) {
        return "פעילים/ות"
      }
      if (codeG == 1) {
        return "פעילים"
      }
      return "פעילות"
    }
    if (codeG == 0) {
      return "חונכים/ות"
    }
    if (codeG == 1) {
      return "חונכים"
    }
    return "חונכות" 
  }

}
