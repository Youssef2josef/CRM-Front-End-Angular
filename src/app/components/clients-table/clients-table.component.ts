import { Router } from '@angular/router';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';

import Swal from 'sweetalert2';
import { ClientService } from 'src/app/services/client.service';
import { EditClientComponent } from '../edit-client/edit-client.component';
import { ClientDataService } from 'src/app/services/client-data.service';
import { DisplayClientComponent } from '../display-client/display-client.component';
import { AddClientComponent } from '../add-client/add-client.component';

export interface UserData {
  id: string;
  name: string;
  contact1: string;
  tel1: string;
  contact2: string;
  tel2: string;
  mail: string;
  region: string;
  pays: string;
}

@Component({
  selector: 'app-clients-table',
  templateUrl: './clients-table.component.html',
  styleUrls: ['./clients-table.component.css']
})
export class ClientsTableComponent implements OnInit {
  clients: UserData[] = []; // Initialize an empty array for clients

  displayedColumns: string[] = ['id', 'name', 'contact1', 'tel1', 'contact2', 'tel2', 'mail', 'region', 'pays', 'actions', 'add'];
  dataSource: MatTableDataSource<UserData>;

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  constructor(private clientService: ClientService, private dialog: MatDialog, private router: Router, private clientDataService: ClientDataService) {
    this.dataSource = new MatTableDataSource(this.clients);
    this.clientDataService.refreshClients$.subscribe(() => {
      this.getAllObjects();
    });
  }

  ngOnInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.getAllObjects();
  }

  getAllObjects() {
    this.clientService.getAllClients().subscribe(
      (data: UserData[]) => {
        this.clients = data;
        this.dataSource.data = this.clients; // Update dataSource with fetched data
      },
      (error) => {
        //console.error('Error fetching clients:', error);
          // Traitement en cas d'erreur
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
          else if (error.message=="Http failure response for http://localhost:8086/api/clients: 401 OK") {
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

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  editRow(id: any) {
    // Implement edit logic here
    this.dialog.open(EditClientComponent, {
      width: '500px',
      data: {
        title: 'Edit Client',
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
        this.clientService.deleteClientById(id).subscribe((res) => {
          console.log("Deleted:", res);
          this.getAllObjects();
          // Navigate to the Objects route
          this.router.navigate(['/Clients']);
        });

        swalWithBootstrapButtons.fire(
          'Excellent!',
          'Object a été supprimé avec succés . Raifraichir la page',
          'success'
        );
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        // User canceled the deletion
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
    this.dialog.open(DisplayClientComponent, {
      width: '500px',
      data: {
        title: 'Affichage Client',
        id: id  // Pass the id to the dialog
      }
    })
  }
  openPopUp() {
    this.dialog.open(AddClientComponent, {
      width: '500px',
      data: {
        title: 'Ajout Client',
      }
    })
  }
}
