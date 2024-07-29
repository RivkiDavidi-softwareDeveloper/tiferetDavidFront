import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Project } from '../../models/project.class';
import { StudentsForProjectComponent } from "../students-for-project/students-for-project.component";

@Component({
    selector: 'app-project',
    standalone: true,
    templateUrl: './project.component.html',
    styleUrl: './project.component.scss',
    imports: [CommonModule, StudentsForProjectComponent]
})
export class ProjectComponent {
@Input() project:Project=new Project(1,"","","","","",1)
displayPopap=false;
  //סגירת הפופפ
  closeP(display: boolean) {
    this.displayPopap = display;
  }
}
