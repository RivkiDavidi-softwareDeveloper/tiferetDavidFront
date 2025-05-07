import { ChangeDetectorRef, Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../services/api.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Taskk } from '../../models/task.class';
import { Worker } from '../../models/worker.class';

@Component({
  selector: 'app-task',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './task.component.html',
  styleUrl: './task.component.scss'
})
export class TaskComponent {
  @Output() popupDisplayOut: EventEmitter<boolean> = new EventEmitter()
  @Input() worker:Worker=new Worker(1,"",1,1,"","","","","")

  Ta_description = ""
  Ta_date = ""
  Ta_time = ""
  validDesc = false;
  popupDisplayIn = true;
  @Input() status = "add"
  @Input() taskUpdate: Taskk | undefined
  constructor(private api: ApiService, private cdRef: ChangeDetectorRef, private snackBar: MatSnackBar) { }
  //תאור
  onInputChangeDesc(event: Event) {
    const describe: string = (event.target as HTMLInputElement).value
    if (describe.length < 4000) {
      this.Ta_description = describe
      this.validDesc = false
    }
    else {
      this.validDesc = true;
    }
  }
  //תאריך
  onInputChangeDate(event: Event) {
    const date: string = (event.target as HTMLInputElement).value
    this.Ta_date = date;
  }
  //שעה
  onInputChangeTime(event: Event) {
    const timeValue: string = (event.target as HTMLInputElement).value;
    const timeParts: string[] = timeValue.split(':'); // מפרק את הערך של הזמן למערך של שעה ודקה
    const hours: number = parseInt(timeParts[0], 10); // ממיר את מחרוזת השעות למספר שלם
    const minutes: number = parseInt(timeParts[1], 10); // ממיר את מחרוזת הדקות למספר שלם
    var hours2 = hours.toString()
    var minutes2 = minutes.toString()
    if (hours2.length == 1) {
      hours2 = "0" + hours2;
    }
    if (minutes2.length == 1) {
      minutes2 = "0" + minutes2;
    }
    this.Ta_time = hours2 + ":" + minutes2;
  }
  //סגירת הפפופפ
  close() {
    this.empty()
    this.popupDisplayOut.emit(false)
  }
  //הוספה
  add(): void {
    if (this.validation()) {
      const taskAdd: Taskk = new Taskk(1, this.worker.Wo_code, this.Ta_description, this.Ta_date, this.Ta_time, 0)
      this.api.AddTask(taskAdd).subscribe(
        (response) => {
          this.snackBar.open('המשימה נוספה בהצלחה', 'סגור', { duration: 2000 });
          this.empty()
          this.popupDisplayOut.emit(false);
        },
        (error) => {
          this.snackBar.open('הוספת המשימה נכשלה', '', { duration: 3000 });
        });

    }
    else {
      this.snackBar.open('חסר פרטים', '', { duration: 3000 });
    }
  }
  //עדכון זמן משימה
  update() {
    if (this.taskUpdate) {
      if (this.Ta_date.length > 0) {
        this.taskUpdate.Ta_date = this.Ta_date
      }
      if(this.Ta_time.length>0){
        this.taskUpdate.Ta_time=this.Ta_time;
      }
      this.api.UpdateTask(this.taskUpdate).subscribe(
        (response) => {
          this.snackBar.open('עודכן בהצלחה', '', { duration: 3000 });
          this.empty()
          this.popupDisplayOut.emit(false);
        },
        (error) => {
          this.snackBar.open('העדכון נכשל', '', { duration: 3000 });
        });
    }

  }
  empty() {
    this.Ta_description = ""
    this.Ta_date = ""
    this.Ta_time = ""
    this.validDesc = false
  }
  validation(): boolean {
    return (!this.validDesc && this.Ta_date.length > 0 && this.Ta_time.length > 0)
  }
}
