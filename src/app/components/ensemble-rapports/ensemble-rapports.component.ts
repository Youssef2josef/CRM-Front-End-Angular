import { Router } from '@angular/router';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import * as XLSX from 'xlsx';

import Swal from 'sweetalert2';
import { RapportService } from 'src/app/services/rapport.service';
import { RapportDataService } from 'src/app/services/rapport-data.service';
import { DisplayRapportComponent } from '../display-rapport/display-rapport.component';
import { EditRapportComponent } from '../edit-rapport/edit-rapport.component';
import { FormGroup } from '@angular/forms';

export interface UserData {
  id: string;
  valid: boolean;
  date: string;
  text: string;
  user: {
    firstName: string;
    lastName: string;
    email: string;
  };
  region: {
    nom: string;
  };
  object: {
    nom: string;
  };
  client: {
    name: string;
  };
}

@Component({
  selector: 'app-ensemble-rapports',
  templateUrl: './ensemble-rapports.component.html',
  styleUrls: ['./ensemble-rapports.component.css']
})
export class EnsembleRapportsComponent implements OnInit {

  rapports: UserData[] = [];
  startDateFilter: Date;
  endDateFilter: Date;
  singleDateFilter: Date;
  displayedColumns: string[] = ['id', 'objectName', 'userFirstName', 'userLastName', 'email', 'clientName', 'regionNom', 'date', 'text', 'valid', 'actions'];
  dataSource: MatTableDataSource<UserData>;
  addingSectionVisible: boolean;
  role: string = '';
  authUserEmail: any;
  fileName: any = 'ExcelSheet.xlsx';
  step = 0;


  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  authUserRole: any;

  constructor(private rapportService: RapportService, private dialog: MatDialog, private router: Router, private rapportDataService: RapportDataService) {
    this.dataSource = new MatTableDataSource(this.rapports);
    this.rapportDataService.refreshRapports$.subscribe(() => {
      this.getAllRapports();
    });
  }
  ngOnInit() {
    if (sessionStorage.getItem("auth-user") != null) {
      this.getAllRapports();
    }
    else {
    }
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
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

  getAllRapports() {
    this.rapportService.getAllRapports().subscribe(
      (data: UserData[]) => {
        this.rapports = data;
        console.log(data);
        this.dataSource.data = this.rapports; // Update dataSource with fetched data
      },
      (error) => {
        //console.log('Error fetching rapports:', error);
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
        else if (error.message == "Http failure response for http://localhost:8086/api/rapportSuivi: 401 OK") {
          Swal.fire({
            title: 'Echec',
            text: "Non authentifié",
            icon: 'warning',
            confirmButtonText: 'OK',
            timer: 2000 // Durée en millisecondes (3 secondes dans cet exemple)
          });
          //console.log(error);
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
      }
    );
  }

  applyFilterColumn(filterValue: string) {
    if (filterValue != null && typeof filterValue === 'string') {
      filterValue = filterValue.trim().toLowerCase();


      const filteredUsers = this.rapports.filter(rapport => {
        // Filtrage par les colonnes textuelles
        const textMatches = (
          rapport.object.nom.toLowerCase().includes(filterValue) ||
          rapport.client.name.toLowerCase().includes(filterValue) ||
          rapport.user.firstName.toLowerCase().includes(filterValue) ||
          rapport.user.lastName.toLowerCase().includes(filterValue) ||
          rapport.user.email.toLowerCase().includes(filterValue) ||
          rapport.region.nom.toLowerCase().includes(filterValue) ||
          rapport.text.toLowerCase().includes(filterValue)
        );

        // Filtrage par les dates
        if (textMatches) {
          let date = this.convertToDate(rapport.date);
          if (this.startDateFilter && this.endDateFilter) {
            console.log("true");
            return date >= this.startDateFilter && date <= this.endDateFilter;
          } else if (this.singleDateFilter) {
            console.log("true2");
            return date.getTime() === this.singleDateFilter.getTime();
          } else {
            console.log("true3");
            return true; // Pas de filtres de dates
          }
        } else {
          console.log("false");
          return false;
        }
      });

      this.dataSource.data = filteredUsers;
      this.dataSource.paginator.length = filteredUsers.length;
    } else {
      console.log(filterValue);
      
      const filteredUsers = this.rapports.filter(rapport => {
        // Filtrage par les dates
          let date = this.convertToDate(rapport.date);
          if (this.startDateFilter && this.endDateFilter && !this.singleDateFilter) {
            console.log("true");
            return date >= this.startDateFilter && date <= this.endDateFilter;
          } else if (this.singleDateFilter && !this.startDateFilter && !this.endDateFilter) {
            console.log("true2");
            return date.getTime() === this.singleDateFilter.getTime();
          } else if((this.startDateFilter || this.endDateFilter) && this.singleDateFilter) {
            console.log("true3");
            Swal.fire({
              title: 'Erreur!',
              text: "Soit Par un intervalle de date Soit un seul date unique !!",
              icon: 'warning',
              timer: 3000, // Durée en millisecondes (ici, 2 secondes)
              showConfirmButton: true // Pour masquer le bouton "OK"
            });
            return false; 
          }
          else{
            console.log("true4");
            return false;
          }
      });
      this.dataSource.data = filteredUsers;
      this.dataSource.paginator.length = filteredUsers.length;
    }
  }



  checkUserRapport(): boolean {
    if (sessionStorage.getItem("auth-user") != null) {
      this.authUserRole = JSON.parse(sessionStorage.getItem("auth-user")).roles[0];
      //console.log(this.authUserRole);
      return this.authUserRole === "ROLE_ADMIN" || this.authUserRole === "ROLE_RESPONSABLE";
    }
    else {
      return false;
    }
  }

  editRow(id: any) {
    // Implement edit logic here
    this.dialog.open(EditRapportComponent, {
      width: '500px',
      data: {
        title: 'Edit Rapport',
        id: id  // Pass the id to the dialog
      }
    })
  }

  deleteRow(id: any) {
    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: 'btn btn-success',
        cancelButton: 'btn btn-danger'
      },
      buttonsStyling: false
    });
    swalWithBootstrapButtons.fire({
      title: 'Vous êtes sure?',
      text: "Vous ne pourrez pas revenir en arrière!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Oui, suprrime!',
      cancelButtonText: 'Non, annule!',
      reverseButtons: true
    }).then((result) => {
      if (result.isConfirmed) {
        // User confirmed the deletion, execute the deletion logic
        this.rapportService.deleteRapportById(id).subscribe((res) => {
          console.log("Deleted:", res);
          this.getAllRapports();
          this.router.navigate(['/Dashboard#profile']);
        });

        swalWithBootstrapButtons.fire(
          'Excellent!',
          'Rapport a été supprimé avec succés . Raifraichir la page',
          'success'
        );
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        swalWithBootstrapButtons.fire(
          'Annulé',
          'Processus a été annulé :)',
          'error'
        );
      }
    });
  }

  viewDetails(id: any) {
    // Implement view details logic here
    this.dialog.open(DisplayRapportComponent, {
      width: '500px',
      data: {
        title: 'Affichage Rapport',
        id: id  // Pass the id to the dialog
      }
    })
  }

  exportexcel(): void {
    /* pass here the table id */
    let element = document.getElementById('DataTable');
    const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(element);

    /* generate workbook and add the worksheet */
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

    /* save to file */
    XLSX.writeFile(wb, this.fileName);

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
  resetStartDate() {
    this.startDateFilter = null;
  }
  
  resetEndDate() {
    this.endDateFilter = null;
  }
  resetSingleDate() {
    this.singleDateFilter = null;
  }
  
}
