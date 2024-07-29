import { ChangeDetectorRef, Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MessageForCall } from '../../models/messageForCall.class';
import { ApiService } from '../../services/api.service';
import { Worker } from '../../models/worker.class';
import { RecipientForMessage } from '../../models/recipientForMessage.class';

@Component({
  selector: 'app-message',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './message.component.html',
  styleUrl: './message.component.scss'
})
export class MessageComponent {
  @Input() message: MessageForCall = new MessageForCall(1, 1, 1, "", "", "", 1)
  listOfWorkers: Array<Worker> = []
  listOfRecipientsForMessage:Array<RecipientForMessage>=[]

  constructor(private api: ApiService, private cdRef: ChangeDetectorRef) {
  }
  ngOnInit(): void {
    this.generalWorkers();
    this.generalRecipientsForMessage();

  }
  //עובדים
  generalWorkers() {
    this.api.getWorkers(0, 0, 0, 0).subscribe(Date => {
      this.listOfWorkers = [];
      this.listOfWorkers.push(...Date);
      this.cdRef.detectChanges();
    });
  }
  //נמענים
  generalRecipientsForMessage(){
    console.log(this.message.MFC_code+"קןודדד")
    this.api.getRecipientsForMessage(this.message.MFC_code).subscribe(Date => {
      this.listOfRecipientsForMessage = [];
      this.listOfRecipientsForMessage.push(...Date);
      this.cdRef.detectChanges();
    });
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
  letter1(name: string) {
    return name.slice(0,1)
  }
}
