import { Component, OnInit, OnDestroy, Output, EventEmitter, Input } from '@angular/core';
import { LocationService } from '../../services/location.service';
import { CommonModule } from '@angular/common';
import { interval, Subscription } from 'rxjs';
import { GeocodingService } from '../../services/geocoding.service';
import { DistanceService } from '../../services/distance.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-distance-tracker',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './distance-tracker.component.html',
  styleUrl: './distance-tracker.component.scss'
})


export class DistanceTrackerComponent implements OnInit, OnDestroy {

  /*   distance: number = 0;
    private previousPosition: GeolocationPosition | null = null;
    private trackingSubscription: Subscription | null = null;
    private intervalId: any;
  
  
  
    startLocation: { latitude: number, longitude: number, accuracy: number, address: string } | null = null;
    currentLocation: { latitude: number, longitude: number, accuracy: number, address: string } | null = null;
  
   */
  /*   startTimer() {
      this.start.emit(true)
    }
    stopTimer() {
      this.stop.emit(true)
    }
    saveTimer() {
      if (this.startLocation && this.currentLocation)
        this.save.emit([this.distance.toString(), this.startLocation?.address, this.currentLocation?.address])
    }    constructor(private locationService: LocationService, private geocodingService: GeocodingService, private distanceService: DistanceService) { }
  
    ngOnInit(): void {
    }
  
    ngOnDestroy(): void {
      this.stopTracking();
    }
    //התחלה
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
    //סיום
    stopTracking(): void {
      if (this.trackingSubscription) {
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
    //חישוב מרחק
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
   */
  deg2rad(deg: number): number {
    return deg * (Math.PI / 180);
  }


  /////שיטה 2
  //טיימר זמן
  @Output() start: EventEmitter<boolean> = new EventEmitter()
  @Output() stop: EventEmitter<boolean> = new EventEmitter()
  @Output() save: EventEmitter<Array<string>> = new EventEmitter()
  @Input() ifDisplayStopAndSaveTime: boolean = false;

  originCoords: GeolocationCoordinates | null = null;
  destinationCoords: GeolocationCoordinates | null = null;

  distanceKm: number = 0;
  durationMin: number | null = null;
  originAddress: string = "";
  destinationAddress: string = "";

  constructor(private distanceService: DistanceService, private snackBar: MatSnackBar,) { }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
    this.setDestinationLocation();
  }
  //התחלה - מוצא
  async setOriginLocation() {
    await new Promise<void>((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(position => {
        this.originCoords = position.coords;
        if (this.originCoords) {
     }
        resolve()

      }, err => {
        alert('שגיאה בזיהוי מיקום מוצא');
        resolve()

      });
    });
  }
  //סיום - יעד
  async setDestinationLocation() {
    await new Promise<void>((resolve, reject) => {

      navigator.geolocation.getCurrentPosition(position => {
        this.destinationCoords = position.coords;
        if (this.destinationCoords) {
          console.log(`מיקום יעד: קו רוחב = ${this.destinationCoords.latitude}, קו אורך = ${this.destinationCoords.longitude}`);
        }
        resolve()
      }, err => {
        alert('שגיאה בזיהוי מיקום יעד');
        resolve()

      });
    });
    this.calculateDistance2()
  }
  //חישוב
  async calculateDistance2() {
    await new Promise<void>((resolve, reject) => {

      if (this.originCoords && this.destinationCoords) {

        this.distanceService.getDistance(this.originCoords, this.destinationCoords)
          .subscribe(data => {
            this.distanceKm = data.distanceKm;
            this.durationMin = data.durationMin;
            this.originAddress = data.originAddress;
            this.destinationAddress = data.destinationAddress;
            this.saveTimer()
            resolve()

          }, err => {
            this.snackBar.open('שגיאה בקבלת נתונים מהשרת', 'x', { duration: 3000 });

/*             alert('שגיאה בקבלת נתונים מהשרת');
 */            resolve()
          });

      } else {
        this.snackBar.open('יש להגדיר מיקום מוצא ויעד', 'x', { duration: 3000 });

/*         alert('יש להגדיר מיקום מוצא ויעד');
 */        resolve()

      }
    });
  }
  startTimer() {
    this.start.emit(true)
  }
  stopTimer() {
    this.stop.emit(true)
  }
  saveTimer() {
    if (this.originCoords && this.destinationCoords)
      this.save.emit([this.distanceKm.toString(), this.originAddress, this.destinationAddress])
  }
}
