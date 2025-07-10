import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgOptimizedImage } from '@angular/common'
import { Student } from '../../models/student.class';
import { Parentt } from '../../models/parent.class';
import { StudentForActivity } from '../../models/studentForActivity.class';
import { ApiService } from '../../services/api.service';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-student',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './student.component.html',
  styleUrl: './student.component.scss'
})
export class StudentComponent {
  borderBOLD: boolean = false;

  @Input() student: Student | undefined
  @Input() selectedStudent: StudentForActivity | undefined
  @Input() listSelectedStudents: Array<StudentForActivity> = [];
  @Input() select = false;

  @Output() addSelectedCodeStudent: EventEmitter<number> = new EventEmitter()
  @Output() deleteSelectedCodeStudent: EventEmitter<number> = new EventEmitter()
  imageBlobURL: string = "";
  lastDate = ""


  constructor(private api: ApiService, private sanitizer: DomSanitizer) { }

  ngOnInit(): void {
    this.getImage()
    this.getLastDate();
  }
  selectStudent() {
    var code = this.student?.St_code

    if (this.select) {
      this.addSelectedCodeStudent.emit(code)
    }
    else {
      this.deleteSelectedCodeStudent.emit(code)
    }

  }
  ifSelected(code: number): boolean {
    var d = false
    this.listSelectedStudents.forEach(st => {
      if (st.SFA_code_student == code) {
        d = true;
      }
    });
    return d;

  }
  getImage(): void {
    if (this.student?.St_image == "yes") {

      const imageName = "student" + this.student?.St_code
      this.api.getStudentImage(imageName)
        .subscribe((data: Blob) => {

          const reader = new FileReader();
          reader.onloadend = () => {
            this.imageBlobURL = reader.result as string;
          };
          reader.readAsDataURL(data);
        });
    }
  }
  //פעילות אחרונה
  getLastDate() {
    if (this.student)
      this.api.getLastActivityForStudent(this.student?.St_code).subscribe(response => {
        this.lastDate = response;
      })
  }
  //האם זמן התדירות עבר
  ifRedPoit(): boolean {
    if (this.student?.St_activity_status == 2 || this.student?.St_activity_status == 3) {
      return false;
    }
    if (this.lastDate) {
      if (this.lastDate === "אין")
        return true;
      const parts = this.lastDate.split('-'); // פיצול התאריך לתתי חלקים על פי המחלקים ביניהם קווים מפרידים
      const year = parseInt(parts[0], 10); // המרת החלק הראשון למספר שלם
      const month = parseInt(parts[1], 10); // המרת החלק השני למספר שלם
      const day = parseInt(parts[2], 10); // המרת החלק השלישי למספר שלם
      const date = new Date(year, month - 1, day); // יצירת אובייקט תאריך מהערכים המקובלים
      var amount = 1
      //בימים
      if (this.student?.St_code_frequency == 1) {
        if (this.student.St_amount_frequency)
          amount = this.student.St_amount_frequency;
      }
      //בשבועות 
      if (this.student?.St_code_frequency == 2) {
        if (this.student.St_amount_frequency)
          amount = this.student.St_amount_frequency * 7;
      }
      //בחודשים
      if (this.student?.St_code_frequency == 3) {
        if (this.student.St_amount_frequency)
          amount = this.student.St_amount_frequency * 30;
      }
      let today = new Date(); // תאריך היום הנוכחי
      let pastDate = new Date(today.getTime() - (amount * 24 * 60 * 60 * 1000)); // חישוב התאריך שנמצא amount ימים אחורה
      if (date >= pastDate) {
        return false;
      }
      else {
        return true;
      }
    }
    return true;
  }
  displayDate(date: string): string {
    if (this.lastDate) {
      if (this.lastDate === "אין")
        return this.lastDate;
      const currentDate = new Date();
      const inputDate = new Date(date);

      const currentYear = currentDate.getFullYear();
      const inputYear = inputDate.getFullYear();

      const currentMonth = currentDate.getMonth();
      const inputMonth = inputDate.getMonth();

      const currentDay = currentDate.getDate();
      var inputDay = inputDate.getDate();

      if (currentYear === inputYear) {
        const months = [
          "ינואר", "פברואר", "מרץ", "אפריל", "מאי", "יוני",
          "יולי", "אוגוסט", "ספטמבר", "אוקטובר", "נובמבר", "דצמבר"
        ];
        const monthName = months[inputMonth];
        return `${inputDay} ב${monthName}`; // התאריך הוא בשנה הנוכחית, מחזירים מחרוזת כפי הדרישות
      } else {
        var day = inputDay.toString()
        if (Number(day) > 10)
          day = "0" + inputDay

        var month = (inputMonth + 1).toString()
        if (Number(month) > 10)
          month = "0" + month

        return `${day}.${month}.${inputYear}`; // התאריך הוא בשנה שונה, מחזירים מחרוזת כפי הדרישות
      }
    }
    return "---"
  }

}
