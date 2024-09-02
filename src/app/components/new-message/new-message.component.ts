import { Worker } from '../../models/worker.class';
import { ApiService } from '../../services/api.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { RecipientForMessage } from '../../models/recipientForMessage.class';
import { ChangeDetectorRef, Component, EventEmitter, Input, Output } from '@angular/core';

import { CommonModule } from '@angular/common';
import { Calll } from '../../models/call.class';
import { MessageForCall } from '../../models/messageForCall.class';
import { waitForAsync } from '@angular/core/testing';
import { FileUploadComponent } from "../file-upload/file-upload.component";
import { DragDropModule } from '@angular/cdk/drag-drop';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';
import { response } from 'express';
@Component({
  selector: 'app-new-message',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './new-message.component.html',
  styleUrl: './new-message.component.scss'
})
export class NewMessageComponent {
  @Input() worker: Worker | undefined
  listOfWorkers: Array<Worker> = []
  listOfWorkersToSend: Array<Worker> = []
  listOfWorkersGroups: Array<Worker> = []

  listOfRecipientForMessage: Array<RecipientForMessage> = []
  searchWorkerToSend = ""
  displayListWorkers = false
  sec = ""
  @Input() codeCall: number |undefined
  //הודעה
  MFC_code = 1
  MFC_call_code = 1
  MFC_sender_worker_code: number | undefined
  MFC_content = ""
  MFC_date = ""
  MFC_time = ""
  //כפתורים קבוצות
  b0 = false
  b1 = false
  b2 = false
  b3 = false
  b4 = false
  b5 = false
  b6 = false
  constructor(private api: ApiService, private cdRef: ChangeDetectorRef, private snackBar: MatSnackBar, public dialog: MatDialog) {
  }
  
  ngOnInit(): void {
    this.generalWorkers()

  }
    //רשימה של עובדים
    public generalWorkers() {
      this.api.getWorkers(0, 0, 0, 0).subscribe(Date => {
        this.listOfWorkers = []
        this.listOfWorkers.push(...Date);
        this.cdRef.detectChanges();
      })
    }
  letter1(name: string | undefined) {
    if (name)
      return name.slice(0, 1)
    return ""
  }
  //הגרלת צבע פרופיל
  getRandomColor(idWorker: string | undefined): string {
    if (idWorker === "111111111")
      return `rgb(${2}, ${241}, ${214})`;
    const r = Number('1' + idWorker?.slice(2, 4))
    const g = Number('1' + idWorker?.slice(4, 6))
    const b = Number('1' + idWorker?.slice(6, 8))

    return `rgb(${r}, ${g}, ${b})`;
  }
  //רשימת נמענים
  async onInputChangeWorkerToSend(event: Event): Promise<void> {
    var str: string = (event.target as HTMLInputElement).value
    var searchStr = "";
    if (str === "") {
      this.searchWorkerToSend = "";
      searchStr = "nulll";
    }
    else {
      searchStr = str;
      this.searchWorkerToSend = str;

    }
    await this.api.FindWorker(searchStr, 0, 0, 0, 0).subscribe(Date => {
      this.listOfWorkersToSend = []
      this.listOfWorkersToSend.push(...Date);
      this.cdRef.detectChanges();
      if (this.listOfWorkersToSend.length > 0 && searchStr !== "nulll") {
        this.displayListWorkers = true
      }
      else
        this.displayListWorkers = false
    })

  }
  //בחירת עובד
  async selectWorker(codeWorker: number) {
    this.listOfRecipientForMessage.push(new RecipientForMessage(1, 1, codeWorker, 0));
    this.searchWorkerToSend = ""
    this.displayListWorkers = false

  }
  //חילוץ שם עובד
  nameWorker(codeWorker: number) {
    var name = "";
    this.listOfWorkers.forEach(w => {
      if (w.Wo_code == codeWorker) {
        name = w.Wo_name + " " + w.Wo_Fname;
      }
    });
    return name;
  }

  //הסרת עובד מרשימת הנמענים
  remove(codeWorker: number) {
    this.listOfRecipientForMessage.forEach((r, index) => {
      if (r.RFM_worker_code === codeWorker) {
        this.listOfRecipientForMessage.splice(index, 1);
      }
    });
    this.cdRef.detectChanges();
  }
  //תוכן
  onInputChangeContect(event: Event) {
    const str: string = (event.target as HTMLInputElement).value
    if (str.length <= 4000) {
      this.MFC_content = str;
    }
  }
  //הוספה
  public async add(): Promise<void> {
    this.MFC_sender_worker_code = this.worker?.Wo_code;
    //רשומות הנמענים

    var listOfRecipientForMessage2: Array<RecipientForMessage> = []
    this.listOfRecipientForMessage.forEach(r => {
      listOfRecipientForMessage2.push(r);
    })
    var genderF = 0
    var typeWF = 0
    //מגדר
    if ((this.b1 && this.b4) || (this.b1 && this.b5) || (this.b1 && this.b6) || (this.b2 && this.b4) || (this.b2 && this.b5) || (this.b2 && this.b6) || (this.b3 && this.b4) || (this.b3 && this.b5) || (this.b3 && this.b6)) {
      genderF = 0
    }
    else {
      if (this.b1 || this.b2 || this.b3) {
        genderF = 1
      }
      if (this.b4 || this.b5 || this.b6) {
        genderF = 2
      }
    }
    //סוג עובד
    if ((this.b2 && this.b3) || (this.b2 && this.b6) || (this.b5 && this.b3) || (this.b5 && this.b6)) {
      typeWF = 0
    }
    else {
      if (this.b2 || this.b5) {
        typeWF = 1
      }
      if (this.b3 || this.b6) {
        typeWF = 2
      }
    }
    this.api.getWorkers(0, genderF, 0, typeWF).subscribe(Date => {
      this.listOfWorkersGroups = []
      this.listOfWorkersGroups.push(...Date);
      this.cdRef.detectChanges();
    })
    this.listOfWorkersGroups.forEach(w => {
      listOfRecipientForMessage2.push(new RecipientForMessage(1, 1, w.Wo_code, 0));
    })
    //הוספת נמענים להודעה
    //כפתורים של הקבוצות
    listOfRecipientForMessage2.forEach(r => {
      r.RFM_message_code = this.MFC_code
    });
    //בדיקה אם יש נמענים
    if (listOfRecipientForMessage2.length == 0) {
      this.snackBar.open('לא בחרת נמענים', 'x', { duration: 3000 });

    }
    else {
      //רשומת הודעה
      var toDayy: Date = new Date();
      var year = toDayy.getFullYear();
      var month = ('0' + (toDayy.getMonth() + 1)).slice(-2); // מוסיף 1 כי החודשים מתחילים מ-0
      var day = ('0' + toDayy.getDate()).slice(-2);
      this.MFC_date = year + '-' + month + '-' + day;
      var hours = ('0' + toDayy.getHours()).slice(-2);
      var minutes = ('0' + toDayy.getMinutes()).slice(-2);
      this.MFC_time = hours + ':' + minutes;
      if(this.MFC_sender_worker_code && this.codeCall){
        const messageAdd: MessageForCall = new MessageForCall(this.MFC_code, this.codeCall, this.MFC_sender_worker_code, this.MFC_content, this.MFC_date, this.MFC_time, undefined, listOfRecipientForMessage2)
          //הוספת הודעה לשיחה
      await this.api.AddMessage(messageAdd).subscribe(
        (response) => {
          this.snackBar.open('ההודעה נשלחה ', 'x', { duration: 3000 });
          this.empty()
          this.close()
        },
        (error) => {
          this.snackBar.open('אירעה שגיאה ', 'x', { duration: 3000 });

          this.sec = error
        });

   

      }
      else{
        this.snackBar.open(' קוד השולח או קוד השיחה בעיייתיים ' +this.codeCall, 'x', { duration: 3000 });

      }

    
    }
  }
  empty() {
    this.MFC_content = ""
    this.listOfRecipientForMessage = []
    this.b0 = false;
    this.b1 = false
    this.b2 = false
    this.b3 = false
    this.b4 = false
    this.b5 = false
    this.b6 = false

  }
    //סגירת הפופפ
    public close(): void {
      this.empty()
/*       this.closeNewCall.emit(false)
 */    }
}
