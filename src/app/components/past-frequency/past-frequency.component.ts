import { ChangeDetectorRef, Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Student } from '../../models/student.class';
import { ApiService } from '../../services/api.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { StudentComponent } from "../student/student.component";

@Component({
    selector: 'app-past-frequency',
    standalone: true,
    templateUrl: './past-frequency.component.html',
    styleUrl: './past-frequency.component.scss',
    imports: [CommonModule, StudentComponent]
})
export class PastFrequencyComponent {
  @Output() popupDisplayOut: EventEmitter<boolean> = new EventEmitter()
  @Input() codeWorker=1
  @Input() listStudent:Array<Student>=[]
  listOfStudents: Array<Student> = []

  constructor(private api: ApiService, private cdRef: ChangeDetectorRef, private snackBar: MatSnackBar) { }
  ngOnInit() {
    this.generalStudents();
  }
  //רשימת חניכים
  public generalStudents(): void {
    this.api.FindStudent("",0, 0, 0, this.codeWorker).subscribe(Date => {
      this.listOfStudents = []
      this.listOfStudents.push(...Date);
      this.cdRef.detectChanges();
    })
  }



  //סגירת הפופפ
  close(): void {
    this.popupDisplayOut.emit(false)
  }
}
