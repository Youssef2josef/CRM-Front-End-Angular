import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { RapportDataService } from 'src/app/services/rapport-data.service';
import { RapportService } from 'src/app/services/rapport.service';
import { HttpErrorResponse } from '@angular/common/http';
import { RegionService } from 'src/app/services/region.service';

@Component({
  selector: 'app-edit-rapport',
  templateUrl: './edit-rapport.component.html',
  styleUrls: ['./edit-rapport.component.css']
})
export class EditRapportComponent implements OnInit {

  inputdata: any;
  editRapportForm !: FormGroup
  findedRapport: any;
  regions: any;
  id: any;
  role: any;
  roleAuthentification: any;
  constructor(@Inject(MAT_DIALOG_DATA) public data: any, private ref: MatDialogRef<EditRapportComponent>, private router: Router, private formBuilder: FormBuilder, private rapportService: RapportService, private rapportDataService: RapportDataService, private regionService: RegionService) { }

  ngOnInit() {
    this.inputdata = this.data;
    this.id = this.data.id;

    this.rapportService.getRapportById(this.id).subscribe((res) => {
      this.findedRapport = res;
      console.log(this.findedRapport);
    });
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
  changeValid() {
    this.findedRapport.valid = !this.findedRapport.valid;
    console.log(this.findedRapport.valid);
  }
  editRapport() {
    if (!this.findedRapport.client.name || !this.findedRapport.object.nom || !this.findedRapport.region.nom || !this.findedRapport.user.email || (this.findedRapport.valid === null || this.findedRapport.valid === undefined)) {
      console.log(this.findedRapport);

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
        this.findedRapport.date = this.convertToDate(this.findedRapport.date);
        const requestPayload = {
          id: this.findedRapport.id,
          text: this.findedRapport.text,
          userEmail: this.findedRapport.user.email,
          regionNom: this.findedRapport.region.nom,
          objectNom: this.findedRapport.object.nom,
          clientNom: this.findedRapport.client.name,
          valid: this.findedRapport.valid,
          date: this.getCurrentDate(this.findedRapport.date),
        };
        console.log(requestPayload);

        this.rapportService.editRapport(requestPayload).subscribe((res) => {
          console.log(res);
          this.rapportDataService.triggerRefreshRapports();
          this.router.navigate(['/Rapports#profile']);
          Swal.fire({
            title: 'Enregistré!',
            icon: 'success',
            timer: 2000, // Durée en millisecondes (ici, 2 secondes)
            showConfirmButton: true // Pour masquer le bouton "OK"
          });
        }, (error: HttpErrorResponse) => {
          if (error.error && error.error.message) {
            Swal.fire({
              title: 'Erreur Crucial',
              text: error.error.message,
              icon: 'error',
              confirmButtonText: 'OK'
            });
          }
        }
        );

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
  getCurrentDate(currentDate: Date): string {
    const year = currentDate.getFullYear();
    const month = ('0' + (currentDate.getMonth() + 1)).slice(-2);
    const day = ('0' + currentDate.getDate()).slice(-2);
    return `${year}-${month}-${day}`;
  }
  convertToDate(input: Date | string): Date {
    if (input instanceof Date) {
      // Si l'entrée est déjà une date, pas de conversion nécessaire
      return input;
    } else if (typeof input === 'string') {
      // Si l'entrée est une chaîne de caractères, la traiter comme une date au format "YYYY-MM-DD"
      const parts = input.split('-');
      const year = parseInt(parts[0], 10);
      const month = parseInt(parts[1], 10) - 1; // Les mois sont indexés de 0 à 11
      const day = parseInt(parts[2], 10);
      return new Date(year, month, day);
    } else {
      // Gérer d'autres types d'entrée si nécessaire
      throw new Error("Input type not supported");
    }
  }
  closepopup() {
    this.ref.close('Closed using function');
  }
  checkAuthentification(): boolean {
    if (sessionStorage.getItem('auth-user') != null) {
      this.role = JSON.parse(sessionStorage.getItem('auth-user')).roles[0];
      if (this.role == "ROLE_ADMIN" || this.role == "ROLE_RESPONSABLE") {
        console.log("true");

        return true;
      }
      else {
        console.log("false");

        return false;
      }
    }
    else {
      console.log("non authentifié");
      return false;
    }
  }
}
