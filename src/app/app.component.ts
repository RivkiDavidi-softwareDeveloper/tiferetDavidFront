import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
@Component({
    selector: 'app-root',
    standalone: true,
    templateUrl: './app.component.html',
    styleUrl: './app.component.scss',
    imports: [CommonModule, RouterOutlet, HomeComponent]
})
export class AppComponent {

  title = 'תפארת דוד';
  list=["moshe","rut","yael"];
  list1=[];
  shouldBeRed: boolean=true;

}  
