import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ObjectDataService } from 'src/app/services/object-data.service';
import { ObjectService } from 'src/app/services/object.service';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-add-object',
  templateUrl: './add-object.component.html',
  styleUrls: ['./add-object.component.css']
})
export class AddObjectComponent implements OnInit {
  inputdata: any;
  addObjectForm !: FormGroup
  object: any = {}
  constructor(@Inject(MAT_DIALOG_DATA) public data: any, private ref: MatDialogRef<AddObjectComponent>, private router: Router, private objectService: ObjectService, private objectDataService: ObjectDataService) { }

  ngOnInit() {
    this.inputdata = this.data;
  }
  closepopup() {
    this.ref.close('Closed using function');
  }
  addObject() {
    console.log("here ****", this.object.nom);
    if (!this.object.nom) {
      Swal.fire({
        title: 'Erreur de remplissage',
        text: 'Tous les champs sont nécessaires',
        icon: 'error',
        confirmButtonText: 'OK',
        timer: 2000 // Durée en millisecondes (3 secondes dans cet exemple)

      });
      return; // Stop the function execution if the nom field is empty
    }
    this.objectService.addObject(this.object).subscribe((res) => {
      console.log("here response from BE", res);
      Swal.fire({
        title: 'Excellent',
        text: 'Objet Ajouté Bien Réussi',
        icon: 'success',
        confirmButtonText: 'OK',
        timer: 2000 // Durée en millisecondes (3 secondes dans cet exemple)

      });
      // Trigger data refresh in ObjectsTableComponent
      this.objectDataService.triggerRefreshObjects();
      this.router.navigate(['/Objects']);
      this.closepopup();
    });
  }
}
