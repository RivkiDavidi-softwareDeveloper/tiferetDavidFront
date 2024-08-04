import { ChangeDetectorRef, Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MessageComponent } from "../message/message.component";
import { CallComponent } from "../call/call.component";
import { ApiService } from '../../services/api.service';
import { Calll } from '../../models/call.class';
import { MessageForCall } from '../../models/messageForCall.class';
import { NewCallComponent } from "../new-call/new-call.component";

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

    
    async openCall(codeCall: number) {
        this.displayOpen = true;
        var calllll=this.listOfCalls.find(c=>c.Ca_code==codeCall)
        this.listOfMessages = [];
        this.listOfMessages=calllll?.MessageForCalls;
/*         // מחכה להורדת ההודעות מהשרת
        await new Promise<void>((resolve, reject) => {
            this.api.getMessagesForCalls(codeCall).subscribe(Date => {
                this.listOfMessages = [];
                this.listOfMessages.push(...Date);
                this.cdRef.detectChanges();
                resolve(); // מסמן שהפעולה הושלמה
            });
        }); */
        // מחכה לעדכון ההודעה האחרונה
        await new Promise<void>((resolve, reject) => {
            this.call.MessageForCalls[this.call.MessageForCalls.length - 1].MFC_done = 1;
            this.api.UpdateMessageDone(this.call.MessageForCalls[this.call.MessageForCalls.length - 1]).subscribe(Date => {
                resolve(); // מסמן שהפעולה הושלמה
            });
        });
    
        this.generalCalls();
    }
    onSelectedMail(event:Event){
        this.mailEnterOrSend = Number((event.target as HTMLInputElement).value);
        this.generalCalls();
    }

}
