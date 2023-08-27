// Create a new service, e.g., object-data.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ObjectDataService {
  private refreshObjectsSource = new BehaviorSubject<boolean>(false);
  refreshObjects$ = this.refreshObjectsSource.asObservable();

  triggerRefreshObjects() {
    this.refreshObjectsSource.next(true);
  }
}
