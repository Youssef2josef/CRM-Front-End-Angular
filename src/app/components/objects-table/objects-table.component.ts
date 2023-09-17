import { Router } from '@angular/router';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ObjectService } from 'src/app/services/object.service';
import { AddObjectComponent } from '../add-object/add-object.component';
import { EditObjectComponent } from'../edit-object/edit-object.component';
import { DisplayObjectComponent } from '../display-object/display-object.component';

import Swal from 'sweetalert2';
import { ObjectDataService } from 'src/app/services/object-data.service';


export interface UserData {
  id: string;
  nom: string;
}

@Component({
  selector: 'app-objects-table',
  templateUrl: './objects-table.component.html',
  styleUrls: ['./objects-table.component.css']
})
export class ObjectsTableComponent implements OnInit {
  objects: UserData[] = []; // Initialize an empty array for objects

  displayedColumns: string[] = ['id', 'nom', 'actions', 'add'];
  dataSource: MatTableDataSource<UserData>;

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  constructor(private objectService: ObjectService,private dialog: MatDialog,private router:Router,private objectDataService: ObjectDataService) {
    this.dataSource = new MatTableDataSource(this.objects);
    this.objectDataService.refreshObjects$.subscribe(() => {
      this.getAllObjects();
    });
  }

  ngOnInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.getAllObjects();
  }

  getAllObjects() {
    this.objectService.getAllObjects().subscribe(
      (data: UserData[]) => {
        this.objects = data;
        this.dataSource.data = this.objects; // Update dataSource with fetched data
      },
      (error) => {
        console.error('Error fetching objects:', error);
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
        else if (error.message=="Http failure response for http://localhost:8086/api/objets: 401 OK") {
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
    this.dialog.open(EditObjectComponent,{
      width:'500px',
      data:{
      title: 'Edit Objet',
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
        this.objectService.deleteObjectById(id).subscribe((res) => {
          console.log("Deleted:", res);
          // Refresh the object list after deletion
          this.getAllObjects();
          // Navigate to the Objects route
          this.router.navigate(['/Objects']);
          swalWithBootstrapButtons.fire(
            'Excellent!',
            'Object a été supprimé avec succés . Raifraichir la page',
            'success'
          );
        });
        
        
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
    this.dialog.open(DisplayObjectComponent,{
      width:'500px',
      data:{
      title: 'Affichage Objet',
      id: id  // Pass the id to the dialog
      }
    })
  }
  openPopUp(){
    this.dialog.open(AddObjectComponent,{
      width:'500px',
      data:{
        title: 'Ajout Objet',
      }
    })
  }

}
