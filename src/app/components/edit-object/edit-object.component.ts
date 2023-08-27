import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { ObjectService } from 'src/app/services/object.service';
import { ObjectDataService } from 'src/app/services/object-data.service'; // Import ObjectDataService

import Swal from 'sweetalert2';

@Component({
  selector: 'app-edit-object',
  templateUrl: './edit-object.component.html',
  styleUrls: ['./edit-object.component.css']
})
export class EditObjectComponent implements OnInit {

  inputdata: any;
  editObjectForm !: FormGroup
  object: any = {}
  id: any;
  findedObject: any

  constructor(@Inject(MAT_DIALOG_DATA) public data: any, private ref: MatDialogRef<EditObjectComponent>, private router: Router, private objectService: ObjectService, private activatedRoute: ActivatedRoute, private objectDataService: ObjectDataService) { }

  ngOnInit() {
    this.inputdata = this.data;
    const id_object = this.data.id;
    this.objectService.getObjectById(id_object).subscribe((res) => {
      this.findedObject = res;
    })
  }
  closepopup() {
    this.ref.close('Closed using function');
  }
  editObject() {
    if (!this.findedObject.nom) {
      Swal.fire({
        title: 'Erreur de remplissage',
        text: 'Tous les champs sont necessaires',
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
        this.objectService.editObject(this.findedObject).subscribe((res) => {
          console.log("here res after edit", res);
          // Trigger data refresh in ObjectsTableComponent
          this.objectDataService.triggerRefreshObjects();
        })
        Swal.fire({
          title: 'Enregistré!',
          icon: 'success',
          timer: 2000, // Durée en millisecondes (ici, 2 secondes)
          showConfirmButton: true // Pour masquer le bouton "OK"
        });
      } else if (result.isDenied) {
        Swal.fire({
          title: 'Les modifications ne sont pas enregistrées!',
          icon: 'info',
          timer: 2000, // Durée en millisecondes (ici, 2 secondes)
          showConfirmButton: true // Pour masquer le bouton "OK"
        });
      }
      else {
        Swal.fire({
          title: 'Modifications annuléss!',
          icon: 'info',
          timer: 2000, // Durée en millisecondes (ici, 2 secondes)
          showConfirmButton: true // Pour masquer le bouton "OK"
        });}
    })
  }

}
