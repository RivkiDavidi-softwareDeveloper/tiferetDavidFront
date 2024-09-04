import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../services/api.service';
import { trigger, state, style, animate, transition } from '@angular/animations';
import { interval } from 'rxjs';
import { map, take } from 'rxjs/operators';
@Component({
  selector: 'app-deshbord',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './deshbord.component.html',
  styleUrl: './deshbord.component.scss',
 
})
export class DeshbordComponent {
  amountBWorkers = 0
  amountBStudents = 0
  amountBActivites = 0
  amountBKilometers = 0
  amountGWorkers = 0
  amountGStudents = 0
  amountGActivites = 0
  amountGKilometers = 0


  constructor(private api: ApiService) { }


   ngOnInit(): void {

 /*      this.general() */
/* 
  //עובדים
  interval(0.1)
      .pipe(take(this.amountBWorkers))
      .subscribe(val => {
    this.amountBWorkers1 = val;
  });
//חניכים
interval(0.1)
  .pipe(take(this.amountBStudents))
  .subscribe(val => {
    this.amountBStudents1 = val;
  });
//עובדות
interval(0.1)
  .pipe(take(this.amountGWorkers))
  .subscribe(val => {
    this.amountGWorkers1 = val;
  });
//חניכות
interval(0.1)
  .pipe(take(this.amountGStudents))
  .subscribe(val => {
    this.amountGStudents1 = val;
  });
     interval(0.0000000000000000001) // Emit a value every second
      .pipe(
        take(45829 / 30), // (45829 / 3) = 15276.33, so emit values up to 15276
        map(val => val * 30) // Increase each emitted value by 3
      )
      .subscribe(val => {
        this.amountBWorkers = val; // Update the number every second
      });  */
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
  this.api.AountsActivities("null", "null",0, 1, -1, -1, Number(day.getMonth) + 1,0, 0).subscribe(Date => {
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
  this.api.AountsActivities("null","null", 0, 2, -1, -1, Number(day.getMonth) + 1, 0,0).subscribe(Date => {
    this.amountGActivites = Date[0];
    this.amountGKilometers = Date[3]
  })
}
//מוסיפה פסיקים
addCommasToNumber(num: number): string {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}


}
