import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  signupUrl: string="http://localhost:8086/api/auth";

  constructor(private http:HttpClient) { }
  login(user){
    return this.http.post<{
      [x: string]: string;accessToken:any
}>(this.signupUrl+"/login",user)
  }
  signup(newUser){
    return this.http.post(this.signupUrl+"/register",newUser)  
  }
  signupResponsable(newResponsable){
    return this.http.post(this.signupUrl+"/register",newResponsable)  
  }
  signupAdmin(newAdmin){
    return this.http.post(this.signupUrl+"/register",newAdmin)  
  }
}
