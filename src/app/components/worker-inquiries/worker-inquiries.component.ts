import { ChangeDetectorRef, Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MessageComponent } from "../message/message.component";
import { CallComponent } from "../call/call.component";
import { ApiService } from '../../services/api.service';
import { Calll } from '../../models/call.class';
import { MessageForCall } from '../../models/messageForCall.class';
import { NewCallComponent } from "../new-call/new-call.component";
import { response } from 'express';
import { RecipientForMessage } from '../../models/recipientForMessage.class';
import { NewMessageComponent } from "../new-message/new-message.component";
import { Worker } from '../../models/worker.class';

@Component({
    selector: 'app-worker-inquiries',
    standalone: true,
    templateUrl: './worker-inquiries.component.html',
    styleUrl: './worker-inquiries.component.scss',
    imports: [CommonModule, MessageComponent, CallComponent, NewCallComponent, NewMessageComponent]
})
export class WorkerInquiriesComponent {
    listOfCalls: Array<Calll> = []
    listOfMessages: Array<MessageForCall> | undefined = []

    call: Calll = new Calll(1, "", [])
    @Input() worker: Worker =new Worker(1,"",1,1,"","","","","")

    displayOpen = false
    mailEnterOrSend: number = 0
    displayAddCall = false
    displayNewMessage=false
    constructor(private api: ApiService, private cdRef: ChangeDetectorRef) {
    }
    ngOnInit(): void {
        this.generalCalls();
        //this.generalMessage();
    }
    //שיחות
    generalCalls() {
        this.api.getCalls(this.worker?.Wo_code, this.mailEnterOrSend).subscribe(Date => {
            this.listOfCalls = [];
            this.listOfCalls.push(...Date);
            this.cdRef.detectChanges();
        });
    }
    /*     //הודעות
        generalMessage() {
            this.api.getMessagesForCalls(this.call.Ca_code).subscribe(Date => {
                this.listOfMessages = [];
                this.listOfMessages.push(...Date);
                this.cdRef.detectChanges();
            });
        } */



    async openCall(listOfMessages: Array<MessageForCall>) {
        // מחכה לעדכון ההודעה האחרונה
        //צריך לעדכן את הרשומה של הנמען  העובד הנוכחישהוא קרא את ההודעה  
        const recipient = listOfMessages[listOfMessages.length - 1].RecipientForMessages.find(r => r.RFM_worker_code == this.worker.Wo_code);
        if (recipient) {
            recipient.RFM_done = 1;
            await new Promise<void>((resolve, reject) => {
                this.api.UpdateRecipientDone(recipient).subscribe(response => {
                    resolve(); // מסמן שהפעולה הושלמה
                });
            });
        }
       
        this.listOfMessages = []
        this.listOfMessages.push(...listOfMessages)
        this.displayOpen = true;
        this.generalCalls();
    }
    onSelectedMail(event: Event) {
        this.mailEnterOrSend = Number((event.target as HTMLInputElement).value);
        this.generalCalls();
    }

}
