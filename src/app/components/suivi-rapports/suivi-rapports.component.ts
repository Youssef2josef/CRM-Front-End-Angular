import { Router } from '@angular/router';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';

import Swal from 'sweetalert2';
import { RapportService } from 'src/app/services/rapport.service';
import { RapportDataService } from 'src/app/services/rapport-data.service';
import { AddRapportComponent } from '../add-rapport/add-rapport.component';
import { EditRapportComponent } from '../edit-rapport/edit-rapport.component';
import { DisplayRapportComponent } from '../display-rapport/display-rapport.component';

export interface UserData {
  id: string;
  valid: boolean;
  date: string;
  text: string;
  user: {
    firstName: string;
    lastName: string;
    email: string;
    roles: {
    }[];
  };
  region: {
    nom: string;
  };
  object: {
    nom: string;
  };
  client: {
    name: string;
    mail: string;
    region: string;
  };
}

@Component({
  selector: 'app-suivi-rapports',
  templateUrl: './suivi-rapports.component.html',
  styleUrls: ['./suivi-rapports.component.css']
})
export class SuiviRapportsComponent implements OnInit {
  rapports: UserData[] = [];

  displayedColumns: string[] = ['id', 'objectName', 'userFirstName', 'userLastName', 'email', 'clientName', 'regionNom', 'valid', 'date', 'text', 'actions', 'add'];
  dataSource: MatTableDataSource<UserData>;
  addingSectionVisible: boolean;
  role: string = '';
  authUserEmail: any;

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  constructor(private rapportService: RapportService, private dialog: MatDialog, private router: Router, private rapportDataService: RapportDataService) {
    this.dataSource = new MatTableDataSource(this.rapports);
    this.rapportDataService.refreshRapports$.subscribe(() => {
      this.getAllRapports();
    });
  }

  ngOnInit() {
    
    this.getAllRapports();
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  getAllRapports() {
    this.rapportService.getAllRapports().subscribe(
      (data: UserData[]) => {
        this.rapports = data;
        this.applyRoleFilter(); // Apply role-based filter after fetching all users
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
          //console.log(error);
        }
        else if (error.message=="Http failure response for http://localhost:8086/api/rapportSuivi: 401 OK") {
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
          //console.log(error);
        }
      }
    );
  }

  applyRoleFilter() {
    const filteredUsers = this.rapports.filter(rapport => this.checkUserRapport(rapport));
    this.dataSource.data = filteredUsers;
    this.dataSource.paginator.length = filteredUsers.length; // Set the paginator length to the count of filtered users
  }

  checkUserRapport(row: UserData): boolean {
    this.authUserEmail = JSON.parse(sessionStorage.getItem("auth-user")).email;
    return row.user.email === this.authUserEmail;
  }

  applyFilterColumn(filterValue: string) {
    filterValue = filterValue.trim().toLowerCase(); // Normalize the input value

    // Filter based on user first name, last name, or email
    const filteredUsers = this.rapports.filter(rapport =>
      this.checkUserRapport(rapport) &&
      (
        rapport.object.nom.toLowerCase().includes(filterValue) ||
        rapport.client.name.toLowerCase().includes(filterValue) ||
        rapport.region.nom.toLowerCase().includes(filterValue))
    );

    this.dataSource.data = filteredUsers;
    this.dataSource.paginator.length = filteredUsers.length;
  }

  openPopUp() {
    this.dialog.open(AddRapportComponent, {
      width: '500px',
      data: {
        title: 'Ajout Rapport',
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

}
