import { ChangeDetectorRef, Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MessageComponent } from "../message/message.component";
import { CallComponent } from "../call/call.component";
import { ApiService } from '../../services/api.service';
import { Calll } from '../../models/call.class';
import { MessageForCall } from '../../models/messageForCall.class';
import { NewCallComponent } from "../new-call/new-call.component";
import { response } from 'express';

@Component({
    selector: 'app-worker-inquiries',
    standalone: true,
    templateUrl: './worker-inquiries.component.html',
    styleUrl: './worker-inquiries.component.scss',
    imports: [CommonModule, MessageComponent, CallComponent, NewCallComponent]
})
export class WorkerInquiriesComponent {
    listOfCalls: Array<Calll> = []
    listOfMessages: Array<MessageForCall>  | undefined= []

    call: Calll = new Calll(1, "",[])
    @Input() codeWorker: number = 1
    displayOpen = false
    mailEnterOrSend:number=0
    displayAddCall=false
    constructor(private api: ApiService, private cdRef: ChangeDetectorRef) {
    }
    ngOnInit(): void {
        this.generalCalls();
        //this.generalMessage();
    }
    //שיחות
    generalCalls() {
        this.api.getCalls(this.codeWorker,this.mailEnterOrSend).subscribe(Date => {
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

    
    async openCall(call:Calll) {
        this.listOfMessages = [];
        this.listOfMessages=call.MessageForCalls;
        console.log(call.MessageForCalls.length+"השיחההה")
        console.log(call.MessageForCalls[this.call.MessageForCalls.length - 1].MFC_content+"השיחההה")
        console.log("רק ה' עוזררררררררררר")
        // מחכה לעדכון ההודעה האחרונה
        await new Promise<void>((resolve, reject) => {
        //    this.call.MessageForCalls[this.call.MessageForCalls.length - 1].MFC_done = 1;
            this.api.UpdateMessageDone(this.call.MessageForCalls[this.call.MessageForCalls.length - 1]).subscribe(response => {
                resolve(); // מסמן שהפעולה הושלמה
            });
        });
        this.displayOpen = true;
        this.generalCalls();
    }
    onSelectedMail(event:Event){
        this.mailEnterOrSend = Number((event.target as HTMLInputElement).value);
        this.generalCalls();
    }

}
