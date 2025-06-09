import { GuideForProject } from "./guideForProject.class";
import { SharerForProject } from "./sharerForProject.class";
import { StudentForProject } from "./studentForProject.class";

// הגדרה כוללת של האובייקט שאתה מקבל מהשרת
export interface GuideWithRelations {
    guide: GuideForProject;
    students: StudentForProject[];
    sharers: SharerForProject[];
}