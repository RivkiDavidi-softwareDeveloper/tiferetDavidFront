import { Activity } from "./activity.class";
import { CategoriesForActivity } from "./categoriesForActivity.class";
import { StudentForActivity } from "./studentForActivity.class";

export class AddActivityRequest {
    constructor(
        public activity: Activity,
        public files: FileList |undefined
    ) { }
}


