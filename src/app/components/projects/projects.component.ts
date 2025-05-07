import { ChangeDetectorRef, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProjectComponent } from "../project/project.component";
import { ApiService } from '../../services/api.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Project } from '../../models/project.class';
import { NewProjectComponent } from "../new-project/new-project.component";

@Component({
    selector: 'app-projects',
    standalone: true,
    templateUrl: './projects.component.html',
    styleUrl: './projects.component.scss',
    imports: [CommonModule, ProjectComponent, NewProjectComponent]
})
export class ProjectsComponent {
    listProject: Array<Project> = []
    displayAddProject=false
    searchText=""
    constructor(private api: ApiService, private cdRef: ChangeDetectorRef, private snackBar: MatSnackBar) { }
    ngOnInit(){
        this.general();
    }
    general() {
        this.api.getProgects(0,this.searchText).subscribe(Date => {
            this.listProject = []
            this.listProject.push(...Date);
            this.cdRef.detectChanges();
        })
    }
      //סגירת הפופפ
  closeP(display: boolean) {
    this.displayAddProject = display;
    this.general();
  }
  //חיפוש פרויקט לפי שם
  onInputChangeSearch(event:Event){
    this.searchText = (event.target as HTMLInputElement).value;
    this.general()
    
  }
}
