import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class LocationService {
  constructor() { }

  // פונקציה שמחזירה Observable של מיקום
  getPosition(): Observable<GeolocationPosition> {
    return new Observable(observer => {
      if (navigator.geolocation) {
        navigator.geolocation.watchPosition(
          (position) => observer.next(position),
          (error) => observer.error(error),
          { enableHighAccuracy: true }
        );
      } else {
        observer.error('Geolocation not available');
      }
    });
  }
}
