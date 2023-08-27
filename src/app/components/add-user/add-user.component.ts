import { HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Component, OnInit, Inject } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { AgentDataService } from 'src/app/services/agent-data.service';
import { AgentService } from 'src/app/services/agent.service';
import { RegionService } from 'src/app/services/region.service';
import Swal from 'sweetalert2';

function forbiddenNullValue(control: AbstractControl) {
  if (control.value === 'null') {
    return { forbiddenNullValue: true };
  }
  return null;
}

@Component({
  selector: 'app-add-user',
  templateUrl: './add-user.component.html',
  styleUrls: ['./add-user.component.css']
})
export class AddUserComponent implements OnInit {
  inputdata: any;
  addAgentForm !: FormGroup
  agent: any = {}
  regions: any;
  hide = true;
  eyeOpen : any ='<i class="fa-solid fa-eye"></i>'
  eyeSlash : any ='<i class="fa-solid fa-eye-slash"></i>';

  multiStep =  new FormGroup({
    firstName: new FormControl('',[Validators.minLength(3), Validators.required]),
    lastName: new FormControl('',[Validators.minLength(3), Validators.required]),

    email: new FormControl('',[Validators.email, Validators.required]),
    password: new FormControl('',[Validators.minLength(6),Validators.maxLength(40), Validators.required, Validators.pattern(/^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/)]),

    region: new FormControl('null',forbiddenNullValue),
    role: new FormControl('agent', Validators.required)
  })

  constructor(@Inject(MAT_DIALOG_DATA) public data: any, private ref: MatDialogRef<AddUserComponent>, private router: Router, private agentService: AgentService, private agentDataService: AgentDataService,private regionService:RegionService) { }

  ngOnInit() {
    this.inputdata = this.data;
    this.getAllRegion();
  }
  getAllRegion() {
    this.regionService.getAllRegions().subscribe(
      (data) => {
        this.regions = data;
        //console.log("x");
      },
      (error) => {
        console.error('Error fetching regions:', error);
      }
    );
  }
  changeRegion(selectedRegion:string){
    console.log(selectedRegion);
  }
  closepopup() {
    this.ref.close('Closed using function');
  }
  addAgent() { 
    if (this.multiStep.get('firstName').value =='null' ||this.multiStep.get('lastName').value =='null' || this.multiStep.get('email').value =='null' || this.multiStep.get('password').value =='null' || this.multiStep.get('region').value =='null') {
      Swal.fire({
        title: 'Erreur de remplissage',
        text: 'Champ Nom et Mail sont necessaires',
        icon: 'error',
        confirmButtonText: 'OK'
      });
      return;
    }
    const requestPayload = {
      firstName: this.multiStep.get('firstName').value,
      lastName: this.multiStep.get('lastName').value,
      email: this.multiStep.get('email').value,
      password: this.multiStep.get('password').value,
      region: this.multiStep.get('region').value,
      role: [this.multiStep.get('role').value],
  };
    //console.log("here ****", requestPayload);

    this.agentService.addUser(requestPayload).subscribe((res) => {
      //console.log("here response from BE", res);
      Swal.fire({
        title: 'Excellent',
        text: 'Utilisateur Ajouté Bien Réussi',
        icon: 'success',
        confirmButtonText: 'OK',
        timer: 2000 // Durée en millisecondes (3 secondes dans cet exemple)

      });
      // Trigger data refresh in ClientsTableComponent
      this.agentDataService.triggerRefreshUsers();
      this.router.navigate(['/Agents']);
      this.closepopup();
    },
    (error: HttpErrorResponse) => {
      // Traitement en cas d'erreur
      if (error.error && error.error.message) {
        Swal.fire({
          title: 'Echec', 
          text: error.error.message,
          icon: 'warning',
          confirmButtonText: 'OK',
          timer: 2000 // Durée en millisecondes (3 secondes dans cet exemple)

        });
        console.log(error);
        
      } else {
        Swal.fire({
          title: 'Echec', 
          text: error.statusText,
          icon: 'warning',
          confirmButtonText: 'OK',
          timer: 2000 // Durée en millisecondes (3 secondes dans cet exemple)

        });
        console.log(error);
        
      }
    });
  }
  getPasswordErrorMessage() {
    const passwordControl = this.multiStep.get('password');
    const errors = passwordControl.errors;
    if(errors!=null){
    if (errors.required) {
      return 'Le mot de passe est requis.';
    }
    if (errors.minlength) {
      return 'Le mot de passe doit avoir au moins 6 caractères.';
    }
    if (errors.maxlength) {
      return 'Le mot de passe doit avoir au max 40 caractères.';
    }
    if (errors.pattern) {
      let message = '';

      if (!/(?=.*[A-Z])/.test(passwordControl.value)) {
        message += 'Ajoutez une lettre majuscule. ';
      }
      if (!/(?=.*\d)/.test(passwordControl.value)) {
        message += 'Ajoutez un chiffre. ';
      }
      if (!/(?=.*[@$!%*?&])/.test(passwordControl.value)) {
        message += 'Ajoutez un symbole.';
      }

      return message;
    }
    }
    return '';
  }
  getRegionErrorMessage() {
    const regionControl = this.multiStep.get('region');
    if (regionControl.hasError('forbiddenNullValue')) {
      return 'Sélection invalide.';
    }
    return '';
  }
  changeRole(selectedRole:string){
    console.log(selectedRole); 
  }
}
