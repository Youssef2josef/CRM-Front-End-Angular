import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RapportDataService {

  private refreshRapportsSource = new BehaviorSubject<boolean>(false);
  refreshRapports$ = this.refreshRapportsSource.asObservable();

  triggerRefreshRapports() {
    this.refreshRapportsSource.next(true);
  }
}