import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { RegionDataService } from 'src/app/services/region-data.service';
import { RegionService } from 'src/app/services/region.service';


import Swal from 'sweetalert2';


@Component({
  selector: 'app-add-region',
  templateUrl: './add-region.component.html',
  styleUrls: ['./add-region.component.css']
})
export class AddRegionComponent implements OnInit {
  inputdata: any;
  addRegionForm !: FormGroup
  region: any = {}
  constructor(@Inject(MAT_DIALOG_DATA) public data: any, private ref: MatDialogRef<AddRegionComponent>, private router: Router, private regionService: RegionService, private regionDataService: RegionDataService) { }

  ngOnInit() {
    this.inputdata = this.data;
  }
  closepopup() {
    this.ref.close('Closed using function');
  }
  addRegion() {
    //console.log("here ****", this.region.nom);
    if (!this.region.nom) {
      Swal.fire({
        title: 'Erreur de remplissage',
        text: 'Tous les champs sont nécessaires',
        icon: 'error',
        confirmButtonText: 'OK'
      });
      return; // Stop the function execution if the nom field is empty
    }
    this.regionService.addRegion(this.region).subscribe((res) => {
      //console.log("here response from BE", res);
      Swal.fire({
        title: 'Excellent',
        text: 'Region Ajouté Bien Réussi',
        icon: 'success',
        confirmButtonText: 'OK',
        timer: 2000 // Durée en millisecondes (3 secondes dans cet exemple)
      });
      this.regionDataService.triggerRefreshRegions();
      this.router.navigate(['/Regions']);
      this.closepopup();
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
}
