import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class RegionDataService {

  private refreshRegionsSource = new BehaviorSubject<boolean>(false);
  refreshRegions$ = this.refreshRegionsSource.asObservable();

  triggerRefreshRegions() {
    this.refreshRegionsSource.next(true);
  }}
