import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
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


  matAmounts: Array<Array<number>> = [[0, 0, 0, 0], [0, 0, 0, 0, 0], [0, 0, 0, 0, 0], [0, 0, 0, 0, 0], [0, 0, 0, 0, 0], [0, 0, 0, 0, 0], [0, 0, 0, 0, 0], [0, 0, 0, 0, 0]]
  constructor(private api: ApiService, private cdRef: ChangeDetectorRef,) { }


  // חישוב stroke-dasharray לפי ערך של ahuz
  getStrokeDasharray(ahuz: number): string {
    const percentage = Math.abs(ahuz);
    return `${percentage}, 100`;
  }

  generalDeshbord() {
    this.api.DisplayDeshbord(this.codeFilter).subscribe(Date => {
      this.matAmounts = []
      this.matAmounts.push(...Date);
    }
    )
  }
  ngOnInit(): void {
      this.getAllWorkers()
    
    this.generalDeshbord()

  }

  //////ישן







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
    this.generalDeshbord()
  }
  //מוסיפה פסיקים
  addCommasToNumber(num: number): string {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }
  //מחלצת שעות מזמן
  hours(time: number): string {
    return (Math.floor(time / 60)).toString();
  }
  //מחלצת דקות מזמן
  minutes(time: number): string {
    return (time % 60).toString();
  }


}
