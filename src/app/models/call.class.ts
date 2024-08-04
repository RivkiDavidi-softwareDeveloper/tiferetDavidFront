import { MessageForCall } from "./messageForCall.class";

export class Calll {
    constructor(
      public Ca_code: number,
      public Ca_topic: string,
      public  MessageForCalls: Array<MessageForCall> 
    ){
    }
}
