/* import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})

export class GeocodingService {
  private apiKey = 'AIzaSyBRgtU-NLaO8pb3AlUnJlLrUwO7qhifAbc'; // הכנס את ה-API Key שלך כאן
  private apiUrl = 'https://maps.googleapis.com/maps/api/geocode/json';

  constructor(private http: HttpClient) { }

  getAddress(latitude: number, longitude: number): Observable<string> {
    const url = `${this.apiUrl}?latlng=${latitude},${longitude}&key=${this.apiKey}`;
    return this.http.get<any>(url).pipe(
      map(response => {
        if (response.results && response.results.length > 0) {
          return response.results[0].formatted_address;
        }
        return 'כתובת לא זמינה';
      })
    );
  }

   getAddress(latitude: number, longitude: number): string {
    this.http.get<any>('https://maps.googleapis.com/maps/api/geocode/json', {
      params: {
        latlng: latitude + ',' + longitude,
        key: 'AIzaSyBRgtU-NLaO8pb3AlUnJlLrUwO7qhifAbc',//הAPI שמתחבר לגוגל מפות
        // accuracy: this.accuracy
      }
    }).subscribe((data) => {
      // איחסון התשובה מהשרת למשתנה של תיאור המיקום
      if (data && data.results && data.results.length > 0) {
        console.log(data.results[0].formatted_address.toString())
        return data.results[0].formatted_address.toString();
      } else {
        return 'Unknown location';
      }
    }
    )
    return ""
  } 

} */

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class GeocodingService {
  private apiKey = 'AIzaSyBRgtU-NLaO8pb3AlUnJlLrUwO7qhifAbc'; // הכנס את ה-API Key שלך כאן
  private apiUrl = 'https://maps.googleapis.com/maps/api/geocode/json';

  constructor(private http: HttpClient) { }

  getAddress(latitude: number, longitude: number): Observable<string> {
    const url = `${this.apiUrl}?latlng=${latitude},${longitude}&key=${this.apiKey}`;
    return this.http.get<any>(url).pipe(
      map(response => {
        if (response.results && response.results.length > 0) {
          return response.results[0].formatted_address;
        }
        return 'כתובת לא זמינה';
      })
    );
  }
}

