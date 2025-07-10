import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SystemLoginComponent } from '../system-login/system-login.component';
import { WorkersLoginComponent } from '../workers-login/workers-login.component';
import test from 'node:test';
import { ApiService } from '../../services/api.service';
import { Worker } from '../../models/worker.class';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { SystemLogin } from '../../models/SystemLogin.class';
import { HttpClient } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FileUploadComponent } from "../file-upload/file-upload.component";
import { DistanceTrackerComponent } from "../distance-tracker/distance-tracker.component";
import { LoadingSpinnerComponent } from "../loading-spinner/loading-spinner.component";
import { error } from 'console';
import { response } from 'express';
import { City } from '../../models/city.class';

@Component({
  selector: 'app-home',
  standalone: true,
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
  imports: [SystemLoginComponent, WorkersLoginComponent, CommonModule, FileUploadComponent, DistanceTrackerComponent, LoadingSpinnerComponent]
})
export class HomeComponent implements OnInit {
  //  console.error("Geolocation is not supported by this browser.");



  sec = true

  systemLoginShow: boolean = false;
  workersLoginShow: boolean = false;
  buttonShow: boolean = true;
  counter1Show = false
  counter2Show = false

  public name: string = ""
  public password: string = ""

  public worker: Worker = new Worker(1, "", 1, 1, "", "", "", "", "",1)
  public system: SystemLogin | undefined

  //חישוב מרחק
  distance: number = 0;
  time: number = 0;
  startLocation: string = '';
  endLocation: string = '';
  // הגדרת משתנים לאחסון המיקום הנוכחי
  latitude: number = 0;
  longitude: number = 0;
  accuracy: number = 0;
  locationDescription = ""

  latitude2: number = 0;
  longitude2: number = 0;
  accuracy2: number = 0;
  locationDescription2 = ""
  //הגדרת משתנים לטיימר
  seconds: number = 0;
  minutes: number = 0;
  hours: number = 0;
  timerInterval: any;
  timerRunning: boolean = true;
  minutesPrivate = 0

  minutesToSend = 0
  kilomet = 0
  exit = ""
  target = ""
  arrarySimple = ["0", "", ""]
  //האם להפעיל אנימציה
  isLoading = false

  constructor(private api: ApiService, private formBuilder: FormBuilder, private cdRef: ChangeDetectorRef, private snackBar: MatSnackBar) {
  }



  //פעולה לטיימר


  startTimer() {

    if (!this.timerInterval) { // בדיקה האם הטיימר כבר רץ
      this.timerInterval = setInterval(() => {
        this.seconds++;
        if (this.seconds > 59) {
          this.seconds = 0;
          this.minutes++;
        }
        if (this.minutes > 59) {
          this.minutes = 0;
          this.hours++;
        }
        this.minutesPrivate = this.hours * 60 + this.minutes
      }, 1000); // קריאה לפונקציה כל שנייה
    }
    else {
      this.seconds = 0;
      this.minutes = 0;
      this.hours = 0;
      clearInterval(this.timerInterval);
      this.timerInterval = null
      this.timerInterval = setInterval(() => {
        this.seconds++;
        if (this.seconds > 59) {
          this.seconds = 0;
          this.minutes++;
        }
        if (this.minutes > 59) {
          this.minutes = 0;
          this.hours++;
        }
        this.minutesPrivate = this.hours * 60 + this.minutes
      }, 1000); // קריאה לפונקציה כל שנייה
    }
  }

  stopTimer() {

    if (this.timerRunning) {
      clearInterval(this.timerInterval);
    } else {
      this.timerInterval = setInterval(() => {
        this.seconds++;
        if (this.seconds > 59) {
          this.seconds = 0;
          this.minutes++;
        }
        if (this.minutes > 59) {
          this.minutes = 0;
          this.hours++;
        }
        this.minutesPrivate = this.hours * 60 + this.minutes
      }, 1000);
    }
    this.timerRunning = !this.timerRunning;
  }
  saveTimer(traveld: Array<string>) {
    this.minutesToSend = this.minutesPrivate 
    this.snackBar.open('המונה נשמר בהצלחה!', 'X', { duration: 2000,panelClass: ['custom-snackbar'] });
    this.seconds = 0;
    this.minutes = 0;
    this.hours = 0;
    clearInterval(this.timerInterval);
    this.timerInterval = null
    this.kilomet = Number(traveld[0])
    this.exit = traveld[1];
    this.target = traveld[2];
  }

  stringTimer(num: number) {
    return num.toString().padStart(2, '0');
  }



  onInputChangeName(event: Event) {
    this.name = (event.target as HTMLInputElement).value;
  }
  onInputChangePassword(event: Event) {
    this.password = (event.target as HTMLInputElement).value;
  }

  ngOnInit() {
  }

  public Login(): void {
    this.isLoading = true
    if (this.name.length > 0 && this.password.length > 0) {
      this.api.getLogin(this.name, this.password).subscribe(
        (response) => {

            if (response.Wo_ID === "0000") {
               this.name=""
              this.password=""
              this.workersLoginShow = false; this.systemLoginShow = true; this.buttonShow = false;
             
              this.isLoading = false
            }
            else {
              this.worker = response;
              this.name=""
              this.password=""
              this.workersLoginShow = true; this.systemLoginShow = false; this.buttonShow = false;
                         
              this.isLoading = false
            }
        },
        (error) => {
                     this.name=""
              this.password=""
          this.isLoading = false;
      
          if (error.status === 405) {
            this.snackBar.open('!שם משתמש וסיסמא אינם קיימים במערכת', 'סגור', { duration: 3000 });
          } else if (error.status === 500) {
            this.snackBar.open('השרת אינו פעיל', 'סגור', { duration: 3000 });
          }else if (error.status === 404) {
            this.snackBar.open('השרת אינו פעיל', 'סגור', { duration: 3000 });
          } else {
            this.snackBar.open('אירעה שגיאה לא צפויה', 'סגור', { duration: 3000 });
          }
        })
    }
    else {
      this.snackBar.open('חסר שם משתמש או סיסמא', 'סגור', { duration: 3000 });
     
      this.isLoading = false

    }


  }
  //-חזרה לבית מכניסת עובדים- סגירת הפופפ
  closeP(display: boolean) {

    this.workersLoginShow = false;
    this.systemLoginShow = false
    this.buttonShow = true;

  }

}
/* 

///////////////// //לקילומטרים
  getCurrentLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
      //  console.log(position)
        // איחסון המיקום הנוכחי במשתנים
        this.latitude = position.coords.latitude;
        this.longitude = position.coords.longitude;
        this.accuracy = position.coords.accuracy;

        this.http.get<any>('https://maps.googleapis.com/maps/api/geocode/json', {
          params: {
            latlng: this.latitude + ',' + this.longitude,
            key: 'AIzaSyBRgtU-NLaO8pb3AlUnJlLrUwO7qhifAbc',//הAPI שמתחבר לגוגל מפות
            accuracy: this.accuracy
          }
        }).subscribe((data) => {
          // איחסון התשובה מהשרת למשתנה של תיאור המיקום
          if (data && data.results && data.results.length > 0) {
            this.locationDescription = data.results[0].formatted_address;
          } else {
            this.locationDescription = 'Unknown location';
          }
        }, (error) => {
          // במקרה של שגיאה בקריאת השרת
         // console.error('Error getting location description:', error);
          this.locationDescription = 'Error getting location';
        });

      }, (error) => {
        // במקרה של שגיאה
        //console.error("Error getting geolocation:", error);
      });
    } else {
      // אם הדפדפן אינו תומך ב-Geolocation
    //  console.error("Geolocation is not supported by this browser.");
    }
  }

  getCurrentLocation2() {
    // למצוא את המיקום הנוכחי השני
    // בדיקת תמיכה ב-Geolocation
    if (navigator.geolocation) {
      // אם נתמקם ניתן, קבל את המיקום הנוכחי
      navigator.geolocation.getCurrentPosition((position) => {
        // איחסון המיקום הנוכחי במשתנים
        this.latitude2 = position.coords.latitude;
        this.longitude2 = position.coords.longitude;
        this.accuracy2 = position.coords.accuracy;
                //רכסים, הרימונים
                this.latitude2=32.749265
                this.longitude2=35.099581
        //אילת
        this.latitude2 = 27.557669
        this.longitude2 = 34.951925
        this.http.get<any>('https://maps.googleapis.com/maps/api/geocode/json', {
          params: {
            latlng: this.latitude2 + ',' + this.longitude2,
            key: 'AIzaSyBRgtU-NLaO8pb3AlUnJlLrUwO7qhifAbc'
            ,
            accuracy: this.accuracy2
          }
        }).subscribe((data) => {
          // איחסון התשובה מהשרת למשתנה של תיאור המיקום
          if (data && data.results && data.results.length > 0) {
            this.locationDescription2 = data.results[0].formatted_address;
          } else {
            this.locationDescription2 = 'Unknown location';
          }
        }, (error) => {
          // במקרה של שגיאה בקריאת השרת
        //  console.error('Error getting location description:', error);
          this.locationDescription2 = 'Error getting location';
        });
      }, (error) => {
        // במקרה של שגיאה
      //  console.error("Error getting geolocation:", error);
      });
    } else {
      // אם הדפדפן אינו תומך ב-Geolocation
   //   console.error("Geolocation is not supported by this browser.");
    }
    //לחשב את המרחק בין שני המיקומים

  }
  public calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number) {
    const R = 6371; // Radius of the earth in kilometers
    const dLat = this.deg2rad(lat2 - lat1);
    const dLon = this.deg2rad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.deg2rad(lat1)) * Math.cos(this.deg2rad(lat2)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const d = R * c; // Distance in kilometers
  //  console.log(d, "מס הקילומטרים:")
    this.distance = d
  }

  public deg2rad(deg: number): number {
    return deg * (Math.PI / 180);
  } */