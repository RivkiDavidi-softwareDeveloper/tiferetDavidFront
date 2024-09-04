import { Injectable } from '@angular/core';
import * as signalR from '@microsoft/signalr';

@Injectable({
  providedIn: 'root'
})

export class SignalrService {
  private hubConnection: signalR.HubConnection;

  constructor() {

      this.hubConnection = new signalR.HubConnectionBuilder()
      .withUrl('https://localhost:44342/studentHub', {
        withCredentials: true // אם אתה זקוק ל-Credentials
      })
      .build();
    this.hubConnection.start().catch(err => console.error(err));
  }

  onStudentAdded(callback: (student: any) => void): void {
    console.log("פותח את ידך")
    this.hubConnection.on('studentAdded', callback);
  }


}
