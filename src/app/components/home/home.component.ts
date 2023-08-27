import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  sideNavStatus: boolean = false;
  authUserRole: any;
  constructor() { }

  ngOnInit() {
  }
  checkUserRapport(): boolean {
    if (sessionStorage.getItem("auth-user") != null) {
      this.authUserRole = JSON.parse(sessionStorage.getItem("auth-user")).roles[0];
      //console.log(this.authUserRole);
      return this.authUserRole === "ROLE_ADMIN" || this.authUserRole === "ROLE_RESPONSABLE";
    }
    else {
      return false;
    }
  }
}
