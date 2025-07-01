import { ChangeDetectorRef, Component, EventEmitter, Input, Output,OnDestroy,OnInit } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { CommonModule } from '@angular/common';
import { Taskk } from '../../models/task.class';
import { ApiService } from '../../services/api.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TaskComponent } from "../task/task.component";
import { isToday, parseISO } from 'date-fns';
import { Worker } from '../../models/worker.class';

@Component({
  selector: 'app-tasks',
  standalone: true,
  templateUrl: './tasks.component.html',
  styleUrl: './tasks.component.scss',
  imports: [CommonModule, TaskComponent]
})
export class TasksComponent implements OnInit, OnDestroy  {
  //סינכרון נתונים בין לקוחות
  socket: Socket | undefined;
  ngOnDestroy(): void {
    if (this.socket)
      this.socket.disconnect();
  }
  connectSocket(): void {
   /*  this.socket = io(this.api.urlBasisSocket, {
      transports: ["websocket"]
    });    this.socket.on("tasks-updated", () => {
    this.generalTasks();
    });
    */
  }

  @Output() amountTask: EventEmitter<boolean> = new EventEmitter()
  amountDisplay = 50;
  amountDisplayNow = 0
  listTaskss: Array<Taskk> = []
  @Input() worker: Worker = new Worker(1, "", 1, 1, "", "", "", "", "")
  displayAddTask = false
  /*  @Input()  displayAddTask = false
   */
  taskUpdate: Taskk | undefined
  displayUpdateTask = false
  constructor(private api: ApiService, private cdRef: ChangeDetectorRef, private snackBar: MatSnackBar) { }
  ngOnInit(): void {
    this.generalTasks();
this.connectSocket()
  }
  generalTasks() {
    this.api.GetAllTastForWorker(this.worker.Wo_code, this.amountDisplay).subscribe(Date => {
      this.listTaskss = [];
      this.listTaskss.push(...Date);
      this.amountDisplayNow = this.listTaskss.length;
      this.cdRef.detectChanges();
    });
  }
  //האם בוצע?
  idDone(code: number) {
    if (code == 1) {
      return 'v'
    }
    return ''
  }
  //תצוגת תאריך
  displayDate(date: string) {
    const [year, month, day] = date.split('-');
    //const dateObj = new Date(year, month - 1, day);
    var yearSh = year.toString().substring(2, 4)
    const inputDate: Date = parseISO(date);
    if (isToday(inputDate)) {
      return "היום"
    }

    return day + "." + month + "." + yearSh
  }
  //מחזירה יום לפי תאריך
  getDayFromDate(dateString: string): string {
    const inputDate: Date = parseISO(dateString);
    if (isToday(inputDate)) {
      return ""
    }
    const parts = dateString.split('-'); // פיצול התאריך לתתי חלקים על פי המחלקים ביניהם קווים מפרידים
    const year = parseInt(parts[0], 10); // המרת החלק הראשון למספר שלם
    const month = parseInt(parts[1], 10); // המרת החלק השני למספר שלם
    const day = parseInt(parts[2], 10); // המרת החלק השלישי למספר שלם
    const date = new Date(year, month - 1, day); // יצירת אובייקט תאריך מהערכים המקובלים
    const dayOfWeek = date.getDay(); // השגת היום בשבוע מתוך התאריך
    switch (dayOfWeek) {
      case 0:
        return "יום ראשון "; break;
      case 1:
        return "יום שני   "; break;
      case 2:
        return 'יום שלישי '; break;
      case 3:
        return 'יום רביעי '; break;
      case 4:
        return 'יום חמישי '; break;
      case 5:
        return 'יום שישי  '; break;
      case 6:
        return 'שבת קודש'; break;
      default:
        return ''
    }
  }
  //הדפסה
  print() {
        // להגדיר את העמוד לרוחב
    const style = document.createElement('style');
    style.innerHTML = '@media print { @page { size: landscape; } }';
    document.head.appendChild(style);
    window.print();

  }
  //עדכון ביצוע
  done(task: Taskk) {
    if (task.Ta_done == 1)
      task.Ta_done = 0
    else
      task.Ta_done = 1
    this.api.UpdateTask(task).subscribe(
      (response) => {
        this.generalTasks();
        this.amountTask.emit(true)

      },
      (error) => {
      }
    );
  }
  //סגירת פופפ הוספה
  closePAdd(display: boolean) {
    this.displayAddTask = display;
    this.displayUpdateTask = display
    this.generalTasks();
    this.amountTask.emit(true)
  }
  //עדכון זמן משימה
  updateTask(taskk: Taskk) {
    this.taskUpdate = taskk
    this.displayUpdateTask = true
  }
  //הצגת עוד 10 הודעות
  displayMore() {
    this.amountDisplay += 10;
    this.generalTasks()
  }
  //מחיקת הודעה

  async deleteTask(code: number) {
    await new Promise<void>((resolve, reject) => {
      this.api.deleteTask(code).subscribe(
        (response) => {
          this.snackBar.open('!המשימה נמחקה בהצלחה', 'x', { duration: 3000 });
          resolve();
        },
        (error) => {
          this.snackBar.open('שגיאה במחיקה', 'x', { duration: 3000 });
          resolve();
        });

    });
    this.generalTasks()
  }

}
