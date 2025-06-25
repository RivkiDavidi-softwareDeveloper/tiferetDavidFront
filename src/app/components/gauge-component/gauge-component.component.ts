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
    const clamped = Math.max(0, Math.min(this.sum, 100));
    this.rotation = -90 + (clamped * 180 / 100); // מ-0 עד 100 -> מ- -90 עד 90
  }
}
