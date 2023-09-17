import { Router } from '@angular/router';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { MatAccordion } from '@angular/material';
import { AgentDataService } from 'src/app/services/agent-data.service';
import { AgentService } from 'src/app/services/agent.service';
import { RegionService } from 'src/app/services/region.service';
import Swal from 'sweetalert2';
import { HttpErrorResponse } from '@angular/common/http';


@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css'],
  
})
export class SettingsComponent implements OnInit {
  @ViewChild(MatAccordion, { static: true }) accordion: MatAccordion;
  inputdata: any;
  editUserForm !: FormGroup
  id:any;
  findedUser:any
  regions: any;
  emailSession: any;
  messageErreur: string;
  firstNameSession: any;
  requestPayload:any;
  step = 0;
  sideNavStatus: boolean = false;

  constructor(private router:Router,private formBuilder: FormBuilder,private agentService:AgentService,private agentDataService:AgentDataService,private regionService:RegionService) { }

  ngOnInit() {
    this.checkAuthentification();
  
    this.agentService.getUserById(this.id).subscribe((res) => {
      //console.log(res);

      this.findedUser = res;
      this.findedUser.password = "";
      //console.log(this.findedUser);
  
      // Move the logic that depends on findedUser inside this subscription block
      this.getAllRegions();
      if (this.emailSession != this.findedUser.email || this.firstNameSession != this.findedUser.firstName) {
        sessionStorage.clear();
        this.router.navigate(['/']);
      }
    });
  }
  
  setStep(index: number) {
    this.step = index;
  }

  nextStep() {
    this.step++;
  }

  prevStep() {
    this.step--;
  }

  editUser() {
    if (!this.findedUser.firstName || !this.findedUser.lastName || !this.findedUser.email || !this.findedUser.password || !this.findedUser.region.nom ) {
      Swal.fire({
        title: 'Erreur de remplissage',
        text: 'Tous les champs sont necessaires',
        icon: 'error',
        confirmButtonText: 'OK'
      });
      return; // Stop the function execution if the nom field is empty
    }
    Swal.fire({
      title: 'Voulez-vous enregistrer les modifications?',
      showDenyButton: true,
      showCancelButton: true,
      confirmButtonText: 'Oui, Bien Sure',
      denyButtonText: `Non, Pas D'accord`,
    }).then((result) => {
      
      if (result.isConfirmed) {
        this.requestPayload = {
          id: this.findedUser.id,
          firstName: this.findedUser.firstName,
          lastName: this.findedUser.lastName,
          email: this.findedUser.email,
          password: this.findedUser.password,
          region: this.findedUser.region.nom, // Send the region's name as a string
          role: this.findedUser.role
      };
  
      this.agentService.editUser(this.requestPayload).subscribe((res) => {
          this.agentDataService.triggerRefreshUsers();
          if(sessionStorage.getItem("auth-user")!=null){
            this.id = JSON.parse(sessionStorage.getItem("auth-user")).id;
            this.emailSession = JSON.parse(sessionStorage.getItem("auth-user")).email;
            this.firstNameSession = JSON.parse(sessionStorage.getItem("auth-user")).firstName;
            //console.log(this.id); 
          }
          else{
          //console.log("Non authentifié");
          }Swal.fire('Enregistré!', '', 'success')
          if(this.emailSession != this.requestPayload.email){
          this.router.navigate(['/']);
          sessionStorage.clear();
          }
          if(this.firstNameSession != this.requestPayload.firstName){
            this.router.navigate(['/']);
          sessionStorage.clear();
          }
      },(error: HttpErrorResponse) => {
        if (error.error && error.error.message) {
            this.messageErreur = error.error.message;
            Swal.fire({
              title: 'Erreur de saisie',
              text: this.messageErreur,
              icon: 'error',
              confirmButtonText: 'OK'
            });
        }
        else {
            this.messageErreur = "Erreur crucial ";
            Swal.fire({
              title: this.messageErreur,
              text: error.statusText,
              icon: 'error',
              confirmButtonText: 'OK'
            });
        }
        //console.log(error);
        });
        
      } else if (result.isDenied) {
        Swal.fire('Les modifications ne sont pas enregistrées', '', 'info')
      }
    })
  }
  checkAuthentification(){
    if(sessionStorage.getItem("auth-user")!=null){
      this.id = JSON.parse(sessionStorage.getItem("auth-user")).id;
      this.emailSession = JSON.parse(sessionStorage.getItem("auth-user")).email;
      this.firstNameSession = JSON.parse(sessionStorage.getItem("auth-user")).firstName;
      //console.log(this.id); 
    }
    else{
      //console.log("Non authentifié");
    }
  }
  changeRegion(e){
    console.log(e.target.value);
  }
  getAllRegions() {
    this.regionService.getAllRegions().subscribe(
      (data) => {
        this.regions = data;
      },
      (error) => {
        console.error('Error fetching regions:', error);
      }
    );
  }
}
