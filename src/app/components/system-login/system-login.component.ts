import { Component, EventEmitter, Input, OnInit, Output, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DisplayWorkersComponent } from "../display-workers/display-workers.component";
import { DisplayStudentsComponent } from "../display-students/display-students.component";
import { ReportsComponent } from "../reports/reports.component";
import { ProjectsComponent } from "../projects/projects.component";
import { SystemLogin } from '../../models/SystemLogin.class';
import { Worker } from '../../models/worker.class';
import { ApiService } from '../../services/api.service';
import { SettingsComponent } from "../settings/settings.component";
import { WorkerInquiriesComponent } from "../worker-inquiries/worker-inquiries.component";
import { DeshbordComponent } from "../deshbord/deshbord.component";

@Component({
    selector: 'app-system-login',
    standalone: true,
    templateUrl: './system-login.component.html',
    styleUrl: './system-login.component.scss',
    imports: [CommonModule, DisplayWorkersComponent, DisplayStudentsComponent, ReportsComponent, ProjectsComponent, SettingsComponent, WorkerInquiriesComponent, DeshbordComponent]
})
export class SystemLoginComponent implements OnInit {
  deshbord=true
  workers: boolean = false;
  students: boolean = false;
  reports: boolean = false;
  projects: boolean = false;
  requests: boolean = false;
  settings: boolean = false;
  worker:Worker=new Worker(1,"",1,1,"","","","","")
  constructor(private api: ApiService) { }

  @Input() system: SystemLogin | undefined
  @Output() popupDisplayOut: EventEmitter<boolean> = new EventEmitter()

  onListSelected(event: Event) {
    this.deshbord=false;
    this.workers = false;
    this.students = false;
    this.reports = false;
    this.projects = false;
    this.requests = false;
    this.settings = false;

    const value = Number((event.target as HTMLInputElement).value);
    switch (value) {
      case 0:this.deshbord=true;break;
      case 1: this.workers = true; break;
      case 2: this.students = true; break;
      case 3: this.reports = true; break;
      case 4: this.projects = true; break;
      case 5: this.requests = true; break;
      case 6: this.settings = true; break;
      default: this.deshbord = true;

    }
  }
  //סגירת הפופפ
  public close(): void {
    this.popupDisplayOut.emit(false)
  }
  //יציאה לאחר 5 דקות של חוסר פעילות

  private inactivityTimer: any;
  private readonly inactivityDuration: number = 5 * 60 * 1000; // 5 minutes in milliseconds
  ngOnInit(): void {
    this.startInactivityTimer();
  }
  startInactivityTimer(): void {
    this.inactivityTimer = setTimeout(() => {
      this.popupDisplayOut.emit(false)

    }, this.inactivityDuration);
  }
  resetInactivityTimer(): void {
    clearTimeout(this.inactivityTimer);
    this.startInactivityTimer();
  }
  @HostListener('document:mousemove')
  @HostListener('document:keypress')
  @HostListener('document:click')
  @HostListener('document:scroll')
  onActivity(): void {
    this.resetInactivityTimer();
  }
}
