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
  @Input() message: MessageForCall = new MessageForCall(1, 1, 1, "", "", "",undefined,[])
  listOfWorkers: Array<Worker> = []

  constructor(private api: ApiService, private cdRef: ChangeDetectorRef) {
  }
  ngOnInit(): void {
    this.generalWorkers();
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
  //הגרלת צבע פרופיל
  getRandomColor(idWorker:string | undefined): string {
    if(idWorker==="111111111")
      return `rgb(${2}, ${241}, ${214})`;
    const r = Number('1'+idWorker?.slice(2,4))
    const g = Number('1'+idWorker?.slice(4,6))
    const b = Number('1'+idWorker?.slice(6,8))

    return `rgb(${r}, ${g}, ${b})`;
  }
}
