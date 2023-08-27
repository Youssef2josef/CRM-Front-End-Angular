import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { ClientDataService } from 'src/app/services/client-data.service';
import { ClientService } from 'src/app/services/client.service';


import Swal from 'sweetalert2';


@Component({
  selector: 'app-edit-client',
  templateUrl: './edit-client.component.html',
  styleUrls: ['./edit-client.component.css']
})
export class EditClientComponent implements OnInit {

  inputdata: any;
  editClientForm !: FormGroup
  id: any;
  findedClient: any

  constructor(@Inject(MAT_DIALOG_DATA) public data: any, private ref: MatDialogRef<EditClientComponent>, private router: Router, private clientService: ClientService, private activatedRoute: ActivatedRoute, private clientDataService: ClientDataService) { }

  ngOnInit() {
    this.inputdata = this.data;
    const id_object = this.data.id;
    this.clientService.getClientById(id_object).subscribe((res) => {
      this.findedClient = res;
    })
  }
  closepopup() {
    this.ref.close('Closed using function');
  }
  editClient() {
    if (!this.findedClient.name || !this.findedClient.mail) {
      Swal.fire({
        title: 'Erreur de remplissage',
        text: 'Champ Nom et Mail sont necessaires',
        icon: 'error',
        confirmButtonText: 'OK',
        timer: 2000 // Durée en millisecondes (3 secondes dans cet exemple)

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
      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {
        this.clientService.editClient(this.findedClient).subscribe((res) => {
          console.log("here res after edit", res);
          // Trigger data refresh in ObjectsTableComponent
          this.clientDataService.triggerRefreshClients();
          Swal.fire({
            title: 'Enregistré!',
            icon: 'success',
            timer: 2000, // Durée en millisecondes (ici, 2 secondes)
            showConfirmButton: true // Pour masquer le bouton "OK"
          });
        }, (error: HttpErrorResponse) => {
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
          }
          else {
            Swal.fire({
              title: 'Echec',
              text: error.statusText,
              icon: 'warning',
              confirmButtonText: 'OK',
              timer: 2000 // Durée en millisecondes (3 secondes dans cet exemple)
    
            });
            console.log(error);
    
          }
        })
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
