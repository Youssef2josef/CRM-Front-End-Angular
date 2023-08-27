import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { AgentDataService } from 'src/app/services/agent-data.service';
import { AgentService } from 'src/app/services/agent.service';
import { RegionService } from 'src/app/services/region.service';
import Swal from 'sweetalert2';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';


@Component({
  selector: 'app-edit-user',
  templateUrl: './edit-user.component.html',
  styleUrls: ['./edit-user.component.css']
})
export class EditUserComponent implements OnInit {
  inputdata: any;
  editUserForm !: FormGroup
  findedUser: any;
  regions: any;
  id: any;

  constructor(@Inject(MAT_DIALOG_DATA) public data: any, private ref: MatDialogRef<EditUserComponent>, private router: Router, private formBuilder: FormBuilder, private agentService: AgentService, private agentDataService: AgentDataService, private regionService: RegionService) { }

  ngOnInit() {
    this.inputdata = this.data;
    this.id = this.data.id;

    this.agentService.getUserById(this.id).subscribe((res) => {
      this.findedUser = res;

      if (this.findedUser.roles[0].name == "ROLE_AGENT") {
        this.findedUser.roles[0].name = "Agent";
      } else if (this.findedUser.roles[0].name == "ROLE_RESPONSABLE") {
        this.findedUser.roles[0].name = "Responsable";
      } else if (this.findedUser.roles[0].name == "ROLE_ADMIN") {
        this.findedUser.roles[0].name = "Admin";
      }
      this.getAllRegions();
    });
  }


  closepopup() {
    this.ref.close('Closed using function');
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

  changeRegion(e) {
    console.log(e.target.value);
  }

  editUser() {
    if (!this.findedUser.roles[0].name) {
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
      Swal.fire('Enregistré!', '', 'success')
      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {
        const transformedRole = this.findedUser.roles[0].name.toLowerCase();
        const requestPayload = {
          id: this.findedUser.id,
          role: [transformedRole],
        };

        this.agentService.editRoleUser(requestPayload).subscribe((res) => {
          this.agentDataService.triggerRefreshUsers();
          this.router.navigate(['/Agents'])

        });

      } else if (result.isDenied) {
        Swal.fire({
          title: 'Les modifications ne sont pas enregistrées!',
          icon: 'info',
          timer: 2000, // Durée en millisecondes (ici, 2 secondes)
          showConfirmButton: true // Pour masquer le bouton "OK"
        });
      } else {
        Swal.fire({
          title: 'Modifications annuléss!',
          icon: 'info',
          timer: 2000, // Durée en millisecondes (ici, 2 secondes)
          showConfirmButton: true // Pour masquer le bouton "OK"
        });
      }
    })
  }
}
