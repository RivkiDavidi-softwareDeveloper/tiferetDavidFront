import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../services/api.service';
import { trigger, state, style, animate, transition } from '@angular/animations';
import { interval } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { Worker } from '../../models/worker.class';
import { GaugeComponentComponent } from "../gauge-component/gauge-component.component";
@Component({
  selector: 'app-deshbord',
  standalone: true,
  imports: [CommonModule, GaugeComponentComponent],
  templateUrl: './deshbord.component.html',
  styleUrl: './deshbord.component.scss',

})
export class DeshbordComponent {
  listWorkers: Array<Worker> = []
  @Input() codeFilter = -1
  @Input() status = "system"
  // -1 כולל
  //-2 כולל בנים
  //-3 כולל בנות
  //אחר - קוד פעיל


  matAmounts: Array<Array<number>> = [[0, 0, 0, 0], [0, 0, 0, 0, 0], [0, 0, 0, 0, 0], [0, 0, 0, 0, 0], [0, 0, 0, 0, 0], [0, 0, 0, 0, 0], [0, 0, 0, 0, 0], [0, 0, 0, 0, 0], [0, 0]]
  constructor(private api: ApiService, private cdRef: ChangeDetectorRef,) { }


  // חישוב stroke-dasharray לפי ערך של ahuz
  getStrokeDasharray(ahuz: number): string {
    const percentage = Math.abs(ahuz);
    return `${percentage}, 100`;
  }

  generalDashboard() {
    this.api.DisplayDashboard(this.codeFilter).subscribe(Date => {
      this.matAmounts = []
      this.matAmounts.push(...Date);
    }
    )
  }
  ngOnInit(): void {
    this.getAllWorkers()

    this.generalDashboard()

  }
  nameWorker(codeWorker: number) {
    const w = this.listWorkers.find(w => w.Wo_code == codeWorker)
    if (w)
      return w.Wo_name + " " + w.Wo_Fname
    return ''
  }
  //////ישן







  //רשימת פעילים
  getAllWorkers() {
    this.api.FindWorker("",0, 0, 0, 0).subscribe(Date => {
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
    this.generalDashboard()
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
