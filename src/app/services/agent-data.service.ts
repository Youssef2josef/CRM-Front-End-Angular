import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class AgentDataService {

  private refreshUsersSource = new BehaviorSubject<boolean>(false);
  refreshUsers$ = this.refreshUsersSource.asObservable();

  triggerRefreshUsers() {
    this.refreshUsersSource.next(true);
  }}
