import { Student } from "./student.class";

export class StudentForProject {
    constructor(
        public SFP_code: number,
        public SFP_code_project: number,
        public SFP_code_student: number,
        public SFP_code_guide:number,
        public Student:Student
    ) {
    }
}