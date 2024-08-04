import { ChangeDetectorRef, Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Calll } from '../../models/call.class';
import { MessageForCall } from '../../models/messageForCall.class';
import { ApiService } from '../../services/api.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Worker } from '../../models/worker.class';
import { waitForAsync } from '@angular/core/testing';
import { RecipientForMessage } from '../../models/recipientForMessage.class';
import { FileUploadComponent } from "../file-upload/file-upload.component";

@Component({
    selector: 'app-new-call',
    standalone: true,
    templateUrl: './new-call.component.html',
    styleUrl: './new-call.component.scss',
    imports: [CommonModule, FileUploadComponent]
})
export class NewCallComponent {
  @Input() codeWorkerSender: number = 1
  listOfWorkers: Array<Worker> = []
  listOfWorkersToSend: Array<Worker> = []
  listOfWorkersGroups: Array<Worker> = []

  listOfRecipientForMessage: Array<RecipientForMessage> = []
  searchWorkerToSend = ""
  displayListWorkers = false
  sec = ""
  //שיחה
  Ca_code = 1
  Ca_topic = ""
  //הודעה
  MFC_code = 1
  MFC_call_code = 1
  MFC_sender_worker_code = 1
  MFC_content = ""
  MFC_date = ""
  MFC_time = ""
  MFC_done = 0
  //כפתורים קבוצות
  b0 = false
  b1 = false
  b2 = false
  b3 = false
  b4 = false
  b5 = false
  b6 = false
  constructor(private api: ApiService, private cdRef: ChangeDetectorRef, private snackBar: MatSnackBar) {
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

  //נושא שיחה
  onInputChangeTopic(event: Event) {
    const str: string = (event.target as HTMLInputElement).value
    if (str.length <= 2000) {
      this.Ca_topic = str;
    }
  }
  //תוכן
  onInputChangeContect(event: Event) {
    const str: string = (event.target as HTMLInputElement).value
    if (str.length <= 4000) {
      this.MFC_content = str;
    }
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
    this.listOfRecipientForMessage.push(new RecipientForMessage(1, 1, codeWorker));
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
  //האם העובד הוא בת או בן
  gender(codeWorker: number) {
    var g=1
    this.listOfWorkers.forEach(w => {
      if (w.Wo_code == codeWorker) {
        g=w.Wo_gender
      }
    });
    return g;
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
  //הוספה
  public async add(): Promise<void> {
    this.MFC_sender_worker_code = this.codeWorkerSender;
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
      listOfRecipientForMessage2.push(new RecipientForMessage(1, 1, w.Wo_code));
    })
     //הוספת נמענים להודעה
     console.log(listOfRecipientForMessage2.length + "רשימית הנמענים:")
     //כפתורים של הקבוצות
     listOfRecipientForMessage2.forEach(r => {
       r.RFM_message_code = this.MFC_code
     });
        //רשומת הודעה
        var toDayy: Date = new Date();
        var year = toDayy.getFullYear();
        var month = ('0' + (toDayy.getMonth() + 1)).slice(-2); // מוסיף 1 כי החודשים מתחילים מ-0
        var day = ('0' + toDayy.getDate()).slice(-2);
        this.MFC_date = year + '-' + month + '-' + day;
        var hours = ('0' + toDayy.getHours()).slice(-2);
        var minutes = ('0' + toDayy.getMinutes()).slice(-2);
        this.MFC_time = hours + ':' + minutes;
        const messageAdd: MessageForCall = new MessageForCall(this.MFC_code, this.MFC_call_code, this.MFC_sender_worker_code, this.MFC_content, this.MFC_date, this.MFC_time, this.MFC_done,listOfRecipientForMessage2)

    //רשומת שיחה
    if (this.Ca_topic == "") {
      this.Ca_topic = "(ללא נושא)";
    }
    const callAdd: Calll = new Calll(this.Ca_code, this.Ca_topic,[messageAdd]);

    //הוספת שיחה
    await this.api.AddCall(callAdd).subscribe(

      (response) => {
        this.Ca_code = response
        messageAdd.MFC_call_code = response;
      },
      (error) => {
        this.sec = error
      });
    this.empty()
  }
  empty() {
    this.Ca_topic = ""
    this.MFC_content = ""
    this.listOfRecipientForMessage = []
    this.b0=false;
    this.b1=false
    this.b2=false
    this.b3=false
    this.b4=false
    this.b5=false
    this.b6=false



  }

























  /*   onInputChangeWorkerToSend(event: Event) {
      const str: string = (event.target as HTMLInputElement).value;
      this.searchWorkerToSend = str;
      // החזרת פרומיס שמבצע את הפעולה generalWorkers
      const generalWorkersPromise = new Promise<void>((resolve, reject) => {
        this.generalWorkers();
        resolve(); // כאשר הפעולה הושלמה, מקבלים את הפרומיס
      });
    
      // המתנה להשלמת הפרומיס ורק אז המשך לפעולות נוספות
      generalWorkersPromise.then(() => {
        if (this.listOfWorkers.length > 0 && str.length > 0) {
          this.displayListWorkers = true;
        } else {
          this.displayListWorkers = false;
        }
      });
    }
     */

}
