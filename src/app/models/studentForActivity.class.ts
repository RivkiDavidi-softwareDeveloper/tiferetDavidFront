import { Student } from "./student.class";

export class StudentForActivity {
    constructor(
      public SFA_code: number,
      public SFA_code_activity: number,
      public SFA_code_student: number,
      public Student:Student | undefined
    ){
    }
  }

  