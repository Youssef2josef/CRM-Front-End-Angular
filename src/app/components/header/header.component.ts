import { Component, EventEmitter, HostListener, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  emailSession:any;
  id:any;
  name:any;
  trasnformationIcon:any;
  isResponsive = false; // Propriété pour stocker l'état responsive

  @Output() sideNavToggled = new EventEmitter<boolean>();
  menuStatus:boolean=false;
  
  constructor(private router:Router) {
    this.checkAuthentification();
  }

  ngOnInit(): void {
    this.checkResponsive(); // Vérification initiale
  }

  doSomething() {
  }

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.checkResponsive(); // Vérification lors du redimensionnement de la fenêtre
  }

  checkResponsive() {
    this.isResponsive = window.innerWidth < 992; // Ajustez la valeur 992 en fonction de votre design responsive
  }
  
  SideNavToggle(){
    this.menuStatus=!this.menuStatus;
    this.sideNavToggled.emit(this.menuStatus);
  }

  checkAuthentification(){
    if(sessionStorage.getItem("auth-user")!=null){
      this.id = JSON.parse(sessionStorage.getItem("auth-user")).id;
      this.emailSession = JSON.parse(sessionStorage.getItem("auth-user")).email;
      this.name = JSON.parse(sessionStorage.getItem("auth-user")).firstName;
      //console.log(this.id);
    }
    else{
      console.log("Non authentifié");
    }
  }

  logout(){
    sessionStorage.clear();
    this.router.navigate(["/"]);
    Swal.fire({
      title: 'Deconnexion Réussie',
      text: 'Vous êtes déconnecté',
      icon: 'info',
      confirmButtonText: 'OK'
    });
  }
}
