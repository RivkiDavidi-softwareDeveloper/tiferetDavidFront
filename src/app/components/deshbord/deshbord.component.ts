import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../services/api.service';
import { trigger, state, style, animate, transition } from '@angular/animations';
import { interval } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { Worker } from '../../models/worker.class';
@Component({
  selector: 'app-deshbord',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './deshbord.component.html',
  styleUrl: './deshbord.component.scss',

})
export class DeshbordComponent {
  listWorkers: Array<Worker> = []
  codeFilter = -1
  // -1 כולל
  //-2 כולל בנים
  //-3 כולל בנות
  //אחר - קוד פעיל
  amountWorkers = 30
  amountChonchim = 11
  amountStudentPail = 82
  amountStudentAll = 321

  matAmounts:Array<Array<number>>=[[1,2,3,4,888],[5,6,7,8,888],[9,10,11,12,888],[13,14,15,16,88]]

//////ישן
  amountBWorkers = 0
  amountBStudents = 0
  amountBActivites = 0
  amountBKilometers = 0
  amountGWorkers = 0
  amountGStudents = 0
  amountGActivites = 0
  amountGKilometers = 0


  constructor(private api: ApiService, private cdRef: ChangeDetectorRef,) { }


  ngOnInit(): void {
    this.getAllWorkers()

    this.general()


  }
  general() {
    //בנים
    //עובדים
    /*   await new Promise<void>((resolve, reject) => { */
    this.api.getAmountWorkers("null", 0, 1, 0, 0).subscribe(Date => {
      this.amountBWorkers = Date
    });  /*  resolve(); // מסמן שהפעולה הושלמה
  }); */

    //חניכים
    this.api.getAmountStudents("null", 0, 1, 0, -1).subscribe(Date => {
      this.amountBStudents = Date
    })
    //פעילויות
    //קילומטרים+
    var day = new Date();
    this.api.AountsActivities("null", "null", 0, 1, -1, -1, Number(day.getMonth) + 1, 0, 0).subscribe(Date => {
      this.amountBActivites = Date[0];
      this.amountBKilometers = Date[3]
    })
    //בנות
    //עובדות
    this.api.getAmountWorkers("null", 0, 2, 0, 0).subscribe(Date => {
      this.amountGWorkers = Date
    })
    //חניכות
    this.api.getAmountStudents("null", 0, 2, 0, -1).subscribe(Date => {
      this.amountGStudents = Date
      console.log("חניכות  " + Date)

    })
    //פעילויות
    //קילומטרים
    this.api.AountsActivities("null", "null", 0, 2, -1, -1, Number(day.getMonth) + 1, 0, 0).subscribe(Date => {
      this.amountGActivites = Date[0];
      this.amountGKilometers = Date[3]
    })
  }
  //רשימת פעילים
  getAllWorkers() {
    this.api.getWorkers(0, 0, 0, 0).subscribe(Date => {
      this.listWorkers = []
      this.listWorkers.push(...Date)
      this.cdRef.detectChanges();
    }
    )
  }
  //בחירת סינון
  selectFilter(event: Event) {
    var num: number = Number((event.target as HTMLInputElement).value)
    this.codeFilter = num
  }
  //מוסיפה פסיקים
  addCommasToNumber(num: number): string {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }


}
