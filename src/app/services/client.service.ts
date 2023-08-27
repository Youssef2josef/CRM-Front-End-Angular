import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ClientService {


  clientUrl: string="http://localhost:8086/api/clients";
  constructor(private http:HttpClient) { }
  addClient(clientObj){
    return this.http.post(this.clientUrl,clientObj)
  }
  getAllClients(){
    return this.http.get(this.clientUrl);
  }
  editClient(clientObj){
    return this.http.put(this.clientUrl, clientObj)
  }
  getClientById(id){
    return this.http.get(this.clientUrl + "/" + id);
  }
  deleteClientById(id){
    return this.http.delete(this.clientUrl + "/" + id);
  }}
