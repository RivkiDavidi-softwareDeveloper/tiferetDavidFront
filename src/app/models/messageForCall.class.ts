import { RecipientForMessage } from "./recipientForMessage.class";

export class MessageForCall {
    constructor(
      public MFC_code: number,
      public MFC_call_code: number,
      public MFC_sender_worker_code: number,
      public MFC_content: string,
      public MFC_date: string,
      public MFC_time: string,
      public MFC_done: number,
     public RecipientForMessages: Array<RecipientForMessage> 
    ){
    }
}
