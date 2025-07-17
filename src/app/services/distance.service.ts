import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';


@Injectable({
  providedIn: 'root'
})
export class DistanceService {

  private apiUrl = 'http://localhost:3000/api/distance';
/*  private apiUrl = 'https://myserver-production-c24f.up.railway.app/api/distance';
 */
  constructor(private http: HttpClient) {}

  getDistance(origin: GeolocationCoordinates, destination: GeolocationCoordinates) {
            if (destination) {
          console.log(`מיקום יעד: קו רוחב = ${destination.latitude}, קו אורך = ${destination.longitude}`);
        }
    const params = new HttpParams()
      .set('originLat', origin.latitude.toString())
      .set('originLng', origin.longitude.toString())
      .set('destLat', destination.latitude.toString())
      .set('destLng', destination.longitude.toString());

    return this.http.get<any>(this.apiUrl, { params });
  }
}

