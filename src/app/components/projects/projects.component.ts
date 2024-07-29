import { ChangeDetectorRef, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProjectComponent } from "../project/project.component";
import { ApiService } from '../../services/api.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Project } from '../../models/project.class';

@Component({
    selector: 'app-projects',
    standalone: true,
    templateUrl: './projects.component.html',
    styleUrl: './projects.component.scss',
    imports: [CommonModule, ProjectComponent]
})
export class ProjectsComponent {
    listProject: Array<Project> = []
    constructor(private api: ApiService, private cdRef: ChangeDetectorRef, private snackBar: MatSnackBar) { }
    ngOnInit(){
        this.general();
    }
    general() {
        this.api.getProgects(0).subscribe(Date => {
            this.listProject = []
            this.listProject.push(...Date);
            this.cdRef.detectChanges();
        })
    }

}
