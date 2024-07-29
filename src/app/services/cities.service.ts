import { Injectable } from '@angular/core';
import { City } from '../models/city.class';
import { Cipher } from 'crypto';
import { Subject,BehaviorSubject, Observable } from 'rxjs';
@Injectable()
export class CitiesService {


 /*  private cities: City[] = [{code:1,name:"רכסים"}
  ,{code:2,name:"ירושלים"}
  ,{code:3,name:"בני ברק"}
  ,{code:4,name:"חיפה"}];
 */
  private subjectCities$:Subject<City>=new Subject();
/*   public behaviorsubjectCities$:BehaviorSubject<City>=new BehaviorSubject(null);
 */  
  public getCity():Observable<City>{
    return this.subjectCities$;

  }
  public setCity(city:City):void{
    this.subjectCities$.next(city)
  }
/*   public getCities():City[]{
    return this.cities;

  }
  public setCities(cities:City[]):void{
    this.cities=[...this.cities,...cities]
  } */
  constructor() { }
}
