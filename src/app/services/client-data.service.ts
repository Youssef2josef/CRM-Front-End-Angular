// Create a new service, e.g., client-data.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class ClientDataService {

  private refreshClientsSource = new BehaviorSubject<boolean>(false);
  refreshClients$ = this.refreshClientsSource.asObservable();

  triggerRefreshClients() {
    this.refreshClientsSource.next(true);
  }}
