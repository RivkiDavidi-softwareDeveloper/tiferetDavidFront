import { Component, OnInit, OnDestroy, Output, EventEmitter, Input } from '@angular/core';
import { LocationService } from '../../services/location.service';
import { CommonModule } from '@angular/common';
import { interval, Subscription } from 'rxjs';
import { GeocodingService } from '../../services/geocoding.service';

@Component({
  selector: 'app-distance-tracker',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './distance-tracker.component.html',
  styleUrl: './distance-tracker.component.scss'
})


export class DistanceTrackerComponent implements OnInit, OnDestroy {

  distance: number = 0;
  private previousPosition: GeolocationPosition | null = null;
  private trackingSubscription: Subscription | null = null;
  private intervalId: any;



  startLocation: { latitude: number, longitude: number, accuracy: number, address: string } | null = null;
  currentLocation: { latitude: number, longitude: number, accuracy: number, address: string } | null = null;

  //טיימר זמן
  @Output() start: EventEmitter<boolean> = new EventEmitter()
  @Output() stop: EventEmitter<boolean> = new EventEmitter()
  @Output() save: EventEmitter<Array<string>> = new EventEmitter()
  @Input() ifDisplayStopAndSaveTime:boolean=false;
startTimer() {
  this.start.emit(true)
}
stopTimer() {
  this.stop.emit(true)
}
saveTimer() {
  if (this.startLocation && this.currentLocation)
    this.save.emit([this.distance.toString(), this.startLocation?.address, this.currentLocation?.address])
}
constructor(private locationService: LocationService, private geocodingService: GeocodingService) { }

ngOnInit(): void {
}

ngOnDestroy(): void {
  this.stopTracking();
}

startTracking(): void {
  this.trackingSubscription = this.locationService.getPosition().subscribe(
    (position) => {
      if (!this.previousPosition) {
        this.previousPosition = position;
        this.startLocation = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy,
          address: ''
        };
        this.updateAddress(this.startLocation);
      }
      this.currentLocation = {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
        accuracy: position.coords.accuracy,
        address: ''
      };
      this.updateAddress(this.currentLocation);
    },
    (error) => console.error(error)
  );

  this.intervalId = setInterval(() => {
    if (this.previousPosition) {
      this.locationService.getPosition().subscribe((currentPosition) => {
        if (this.previousPosition) {
          const distanceIncrement = this.calculateDistance(
            this.previousPosition.coords.latitude,
            this.previousPosition.coords.longitude,
            currentPosition.coords.latitude,
            currentPosition.coords.longitude
          );
          this.distance += distanceIncrement;
          this.previousPosition = currentPosition;
          this.currentLocation = {
            latitude: currentPosition.coords.latitude,
            longitude: currentPosition.coords.longitude,
            accuracy: currentPosition.coords.accuracy,
            address: ''
          };
          this.updateAddress(this.currentLocation);
        }
      });
    }
  }, 50000);
}

stopTracking(): void {
  if(this.trackingSubscription) {
  this.trackingSubscription.unsubscribe();
}
if (this.intervalId) {
  clearInterval(this.intervalId);
}
this.saveTimer()
  }
//עדכון שם כתובת

updateAddress(location: { latitude: number, longitude: number, accuracy: number, address: string }): void {
  this.geocodingService.getAddress(location.latitude, location.longitude).subscribe(
    (address) => {
      location.address = address;
      console.log(location.latitude)
      console.log(location.longitude)
      console.log(location.accuracy)
      console.log(location.address)
    },
    (error) => {
      location.address = 'כתובת לא זמינה';
      console.error(error);
    }
  );
}

calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371;
  const dLat = this.deg2rad(lat2 - lat1);
  const dLon = this.deg2rad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(this.deg2rad(lat1)) * Math.cos(this.deg2rad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;
  return distance;
}

deg2rad(deg: number): number {
  return deg * (Math.PI / 180);
}
}
