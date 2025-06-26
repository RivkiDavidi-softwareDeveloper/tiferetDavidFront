import { Component, Input, OnChanges } from '@angular/core';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-gauge-component',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './gauge-component.component.html',
  styleUrl: './gauge-component.component.scss'
})

export class GaugeComponentComponent implements OnChanges {



  @Input() sum: number = 0;
  rotation: number = 0;
  arcPath: string = '';
ticks = Array.from({ length: 21 }, (_, i) => i * 10);

  ngOnChanges(): void {
    if (this.sum < 0) {
      this.sum = 0
    }
    if (this.sum > 200) {
      this.sum = 200
    }
    const clamped = Math.max(0, Math.min(this.sum, 200));
    this.rotation = -90 + (clamped * 180 / 200);
    this.arcPath = this.getArcPath(this.sum);
  }



   private getArcPath(value: number): string {
    const cx = 100, cy = 100, r = 82;
    const fromValue = value > 100 ? 100 : value;
    const toValue = value > 100 ? value : 100;
    const fromAngle = (-180 + (fromValue * 180 / 200)) * Math.PI / 180;
    
    const toAngle = (-180 + (toValue * 180 / 200)) * Math.PI / 180;

    const x1 = cx + r * Math.cos(fromAngle);
    const y1 = cy + r * Math.sin(fromAngle);
    const x2 = cx + r * Math.cos(toAngle);
    const y2 = cy + r * Math.sin(toAngle);
  // const largeArcFlag = toValue - fromValue > 100 ? 1 : 0;
      const largeArcFlag = 0

    return `M ${x1} ${y1} A ${r} ${r} 0 ${largeArcFlag} 1 ${x2} ${y2}`;
  }

}
