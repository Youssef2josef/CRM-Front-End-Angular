import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AgentService {
  

  userUrl: string="http://localhost:8086/api/agents";
  constructor(private http:HttpClient) { }
  addUser(objectObj){
    return this.http.post(this.userUrl,objectObj)
  }
  getAllUsers(){
    return this.http.get(this.userUrl);
  }
  editUser(objectObj){
    return this.http.put(this.userUrl, objectObj)
  }
  getUserById(id){
    return this.http.get(this.userUrl + "/" + id);
  }
  deleteUserById(id){
    return this.http.delete(this.userUrl + "/" + id);
  }
  editRoleUser(objectObj){
    return this.http.patch(this.userUrl, objectObj)
  }
}
