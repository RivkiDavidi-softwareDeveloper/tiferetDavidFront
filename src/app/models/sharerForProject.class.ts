import { Sharer } from "./sharer.class";

export class SharerForProject {
  constructor(
    public SFP_code: number,
    public SFP_code_project: number,
    public SFP_code_Sharer: number,
    public SFP_code_guide: number,
    public SFP_name_school_bein_hazmanim: string,
    public SFP_veshinantem: string,

    public Sharer: Sharer


  ) { }
}
