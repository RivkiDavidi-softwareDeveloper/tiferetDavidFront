import { Component, Input, OnChanges } from '@angular/core';

@Component({
  selector: 'app-gauge-component',
  standalone: true,
  imports: [],
  templateUrl: './gauge-component.component.html',
  styleUrl: './gauge-component.component.scss'
})

export class GaugeComponentComponent implements OnChanges {
  @Input() sum: number = 0; // הערך שבגינו נזיז את המחוג

  rotation: number = 0;

  ngOnChanges(): void {
    this.sum = this.sum + 100
    if (this.sum < 0) {
      this.sum = 0
    }
    if (this.sum > 200) {
      this.sum = 200
    }
    const clamped = Math.max(0, Math.min(this.sum, 200));
    this.rotation = -90 + (clamped * 180 / 200); // סיבוב מ- -90 עד 90
  }

}
