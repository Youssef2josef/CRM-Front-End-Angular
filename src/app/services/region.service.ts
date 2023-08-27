import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class RegionService {
  regionUrl: string="http://localhost:8086/api/regions";

  constructor(private http:HttpClient) { }
  getAllRegions(){
    return this.http.get(this.regionUrl);
  }
  addRegion(regionObj){
    return this.http.post(this.regionUrl,regionObj)
  }
  editRegion(regionObj){
    return this.http.put(this.regionUrl, regionObj)
  }
  getRegionById(id){
    return this.http.get(this.regionUrl + "/" + id);
  }
  deleteRegionById(id){
    return this.http.delete(this.regionUrl + "/" + id);
  }
}
