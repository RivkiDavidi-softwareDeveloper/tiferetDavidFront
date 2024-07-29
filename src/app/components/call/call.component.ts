import { ChangeDetectorRef, Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Calll } from '../../models/call.class';
import { MessageComponent } from "../message/message.component";
import { ApiService } from '../../services/api.service';
import { MessageForCall } from '../../models/messageForCall.class';
import { Worker } from '../../models/worker.class';
import { fail } from 'assert';

@Component({
  selector: 'app-call',
  standalone: true,
  templateUrl: './call.component.html',
  styleUrl: './call.component.scss',
  imports: [CommonModule, MessageComponent]
})
export class CallComponent {

  //לקבל עצם מסוג שיחה
  @Input() call: Calll = new Calll(1, "")
  @Input() codeWorker = 1
  @Output() codeCall: EventEmitter<number> = new EventEmitter()
  listOfMessages: Array<MessageForCall> = []
  listOfWorkers: Array<Worker> = []
  displayOpen = false
  constructor(private api: ApiService, private cdRef: ChangeDetectorRef) {
  }
  ngOnInit(): void {
    this.generalMessage();
    this.generalWorkers();
  }
  //הודעות
  generalMessage() {
    this.api.getMessagesForCalls(this.call.Ca_code).subscribe(Date => {
      this.listOfMessages = [];
      this.listOfMessages.push(...Date);
      this.cdRef.detectChanges();
    });
  }
  //עובדים
  generalWorkers() {
    this.api.getWorkers(0, 0, 0, 0).subscribe(Date => {
      this.listOfWorkers = [];
      this.listOfWorkers.push(...Date);
      this.cdRef.detectChanges();
    });
  }
  //חילוץ שם עובד
  nameWorker(codeWorker: number, num: number) {
    if (codeWorker == this.codeWorker)
      return "אני" + " "
    var name = "";
    this.listOfWorkers.forEach(w => {
      if (w.Wo_code == codeWorker) {
        name = w.Wo_name + " " + w.Wo_Fname;
      }
    });
    if (num == 1)
      return name;
    const spaceIndex = name.indexOf(' ');
    const firstName = name.substring(0, spaceIndex);
    return firstName + " "
  }
  //פתיחת תצוגת שיחה
  openCall(code: number): void {
    this.codeCall.emit(code);
  }
  /*   displayDate(date:string,time:string){
      const [year, month, day] = date.split('-');
      const dateObj = new Date(Number(year), Number(month) - 1, Number(day));
  
      var yearSh = year.toString().substring(2, 4)
      return day + "." + month + "." + yearSh
      if(date)
    } */

  displayDate(date: string, time: string): string {
    const currentDate = new Date();
    const inputDate = new Date(date);

    const currentYear = currentDate.getFullYear();
    const inputYear = inputDate.getFullYear();

    const currentMonth = currentDate.getMonth();
    const inputMonth = inputDate.getMonth();

    const currentDay = currentDate.getDate();
    var inputDay = inputDate.getDate();

    if (currentYear === inputYear && currentMonth === inputMonth && currentDay === inputDay) {
      return time; // התאריך הוא התאריך הנוכחי, מחזירים רק את השעה
    } else if (currentYear === inputYear) {
      const months = [
        "ינואר", "פברואר", "מרץ", "אפריל", "מאי", "יוני",
        "יולי", "אוגוסט", "ספטמבר", "אוקטובר", "נובמבר", "דצמבר"
      ];
      const monthName = months[inputMonth];
      return `${inputDay} ב${monthName}`; // התאריך הוא בשנה הנוכחית, מחזירים מחרוזת כפי הדרישות
    } else {
      var day = inputDay.toString()
      if (Number(day) > 10)
        day = "0" + inputDay

      var month = (inputMonth + 1).toString()
      if (Number(month) > 10)
        month = "0" + month

      return `${day}.${month}.${inputYear}`; // התאריך הוא בשנה שונה, מחזירים מחרוזת כפי הדרישות
    }
  }






}
