import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { RegionDataService } from 'src/app/services/region-data.service';
import { RegionService } from 'src/app/services/region.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-edit-region',
  templateUrl: './edit-region.component.html',
  styleUrls: ['./edit-region.component.css']
})
export class EditRegionComponent implements OnInit {

  inputdata: any;
  editRegionForm !: FormGroup
  object: any = {}
  id: any;
  findedRegion: any

  constructor(@Inject(MAT_DIALOG_DATA) public data: any, private ref: MatDialogRef<EditRegionComponent>, private router: Router, private regionService: RegionService, private activatedRoute: ActivatedRoute, private regionDataService: RegionDataService) { }

  ngOnInit() {
    this.inputdata = this.data;
    const id_object = this.data.id;
    this.regionService.getRegionById(id_object).subscribe((res) => {
      this.findedRegion = res;
    })
  }
  closepopup() {
    this.ref.close('Closed using function');
  }
  editRegion() {
    Swal.fire({
      title: 'Voulez-vous enregistrer les modifications?',
      showDenyButton: true,
      showCancelButton: true,
      confirmButtonText: 'Oui, Bien Sure',
      denyButtonText: `Non, Pas D'accord`,
    }).then((result) => {
      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {
        this.regionService.editRegion(this.findedRegion).subscribe((res) => {
          console.log("here res after edit", res);
          // Trigger data refresh in ObjectsTableComponent
          this.regionDataService.triggerRefreshRegions();Swal.fire({
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
