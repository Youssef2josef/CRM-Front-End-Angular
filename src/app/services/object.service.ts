import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ObjectService {

  objectUrl: string="http://localhost:8086/api/objets";
  constructor(private http:HttpClient) { }
  addObject(objectObj){
    return this.http.post(this.objectUrl,objectObj)
  }
  getAllObjects(){
    return this.http.get(this.objectUrl);
  }
  editObject(objectObj){
    return this.http.put(this.objectUrl, objectObj)
  }
  getObjectById(id){
    return this.http.get(this.objectUrl + "/" + id);
  }
  deleteObjectById(id){
    return this.http.delete(this.objectUrl + "/" + id);
  }
}
