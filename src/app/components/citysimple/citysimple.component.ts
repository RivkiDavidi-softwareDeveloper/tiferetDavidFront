import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { City } from '../../models/city.class';

@Component({
  selector: 'app-citysimple',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './citysimple.component.html',
  styleUrl: './citysimple.component.scss'
})
export class CitysimpleComponent {

  @Input() city: City | undefined;
  @Input() indexCity:number | undefined;
  @Output() onCityDelete:EventEmitter<number>=new EventEmitter()
  public deleteCity(): void{

    this.onCityDelete.emit(this.indexCity)
  }
  ;
}
