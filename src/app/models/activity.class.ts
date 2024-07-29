import { CategoriesForActivity } from "./categoriesForActivity.class";
import { StudentForActivity } from "./studentForActivity.class";

export class Activity {
    constructor(
      public AFS_code: number,
      public AFS_worker_code: number,
      public AFS_date: string,
      public AFS_activity_time: number,
      public AFS_with_who: string,
      public AFS_short_description: string,
      public AFS_description: string,
      public AFS_price: number,
      public AFS_exit: string,  //מוצא
      public AFS_target: string, //יעד
      public AFS_kilometer: number,
      public AFS_name_school: string,
      public StudentForActivities: StudentForActivity[],
      public CategoriesForActivities: CategoriesForActivity[],
    ){
    }
}
