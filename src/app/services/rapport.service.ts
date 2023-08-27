import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class RapportService {


  RapportUrl: string="http://localhost:8086/api/rapportSuivi";
  constructor(private http:HttpClient) { }
  addRapport(RapportObj){
    return this.http.post(this.RapportUrl,RapportObj)
  }
  getAllRapports(){
    return this.http.get(this.RapportUrl);
  }
  editRapport(RapportObj){
    return this.http.put(this.RapportUrl, RapportObj)
  }
  getRapportById(id){
    return this.http.get(this.RapportUrl + "/" + id);
  }
  deleteRapportById(id){
    return this.http.delete(this.RapportUrl + "/" + id);
  }
}
