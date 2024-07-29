import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideClientHydration } from '@angular/platform-browser';
import { withFetch } from '@angular/common/http';
import {provideHttpClient} from '@angular/common/http';

export const appConfig: ApplicationConfig = {
  providers: [provideRouter(routes), provideClientHydration(),provideHttpClient(withFetch()), provideAnimationsAsync(), provideAnimationsAsync()]
};



import { FormGroup, FormBuilder } from  '@angular/forms';
import { NgModule } from "@angular/core";
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
