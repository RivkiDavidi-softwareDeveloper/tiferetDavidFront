import { BrowserModule } from "@angular/platform-browser";
import { NgModel } from "@angular/forms";
import { AppComponent } from "./app.component";
import { NgModule } from "@angular/core";
import { HttpClientModule } from "@angular/common/http";
import { ReactiveFormsModule } from '@angular/forms';
import { DistanceTrackerComponent } from './components/distance-tracker/distance-tracker.component';
import { LocationService } from './services/location.service';
import { GeocodingService } from './services/geocoding.service';

@NgModule({
  imports: [ReactiveFormsModule, BrowserModule, HttpClientModule],
  bootstrap: [AppComponent],
  providers: [LocationService, GeocodingService],
})

export class AppModule {
}




