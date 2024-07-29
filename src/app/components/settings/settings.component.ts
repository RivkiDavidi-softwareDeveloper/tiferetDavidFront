import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { AddUpdateWorkerComponent } from "../add-update-worker/add-update-worker.component";
import { ApiService } from '../../services/api.service';
import { Worker } from '../../models/worker.class';
import { TypeWorker } from '../../models/TypeWorker.enum';
import { TypeGender } from '../../models/TypeGender.enum';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SystemLogin } from '../../models/SystemLogin.class';
@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.scss'
})
export class SettingsComponent {

  public system: SystemLogin = new SystemLogin(1, "", "")
displayPopap=false
  SL_name = ""
  SL_password = ""

  constructor(private api: ApiService, private cdRef: ChangeDetectorRef, private snackBar: MatSnackBar) { }
  ngOnInit(): void {
    this.general();
  }
  general() {
    this.api.getLoginSystem2().subscribe(Date => {
      this.system = Date;
      this.cdRef.detectChanges();
    })

  }
  onInputChangePS(event: Event) {
    this.SL_password = (event.target as HTMLInputElement).value;
  }
  onInputChangeName(event: Event) {
    this.SL_name = (event.target as HTMLInputElement).value;
  }
  update() {
    if (this.SL_name.length > 0) {
      this.system.SL_name = this.SL_name;
    }
    if (this.SL_password.length > 0) {
      this.system.SL_password = this.SL_password
    }
    this.api.UpdateLoginSystem(this.system).subscribe(Date => {
    })
  }
  close() {
    this.displayPopap=false
    }
}
