export class RecipientForMessage {
    constructor(
      public RFM_code: number,
      public RFM_message_code: number,
      public RFM_worker_code: number,
      public RFM_done:number // --ערך בוליאני 0 או 1 1-נקרא

    ){}
  }
