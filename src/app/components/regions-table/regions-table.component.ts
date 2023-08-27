import { EditRegionComponent } from './../edit-region/edit-region.component';
import { Router } from '@angular/router';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';

import Swal from 'sweetalert2';
import { RegionService } from 'src/app/services/region.service';
import { DisplayRegionComponent } from '../display-region/display-region.component';
import { AddRegionComponent } from '../add-region/add-region.component';
import { RegionDataService } from 'src/app/services/region-data.service';
import { HttpErrorResponse } from '@angular/common/http';

export interface RegionData {
  id: string;
  nom: string;
}

@Component({
  selector: 'app-regions-table',
  templateUrl: './regions-table.component.html',
  styleUrls: ['./regions-table.component.css']
})
export class RegionsTableComponent implements OnInit {

  regions: RegionData[] = []; // Initialize an empty array for regions

  displayedColumns: string[] = ['id', 'nom', 'actions', 'add'];
  dataSource: MatTableDataSource<RegionData>;

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  constructor(private regionService: RegionService,private dialog: MatDialog,private router:Router,private regionDataService: RegionDataService) {
    this.dataSource = new MatTableDataSource(this.regions);
    this.regionDataService.refreshRegions$.subscribe(() => {
      this.getAllRegions();
    });
  }

  ngOnInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.getAllRegions();
  }

  getAllRegions() {
    this.regionService.getAllRegions().subscribe(
      (data: RegionData[]) => {
        //console.log(data);
        this.regions = data;
        this.dataSource.data = this.regions; // Update dataSource with fetched data
      },
      (error) => {
        //console.error('Error fetching regions:', error);
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
        else if (error.message=="Http failure response for http://localhost:8086/api/regions: 401 OK") {
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
    this.dialog.open(EditRegionComponent,{
      width:'500px',
      data:{
      title: 'Edit Region',
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
        this.regionService.deleteRegionById(id).subscribe((res) => {
          console.log("Deleted:", res);
          Swal.fire({
            title: 'Excellent',
            text: 'Region a été supprimé avec succés . Raifraichir la page',
            icon: 'success',
            confirmButtonText: 'OK',
            timer: 2000 // Durée en millisecondes (3 secondes dans cet exemple)
          });
          // Refresh the region list after deletion
          this.getAllRegions();
          // Navigate to the Regions route
          this.router.navigate(['/Regions']);
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
            //console.log(error);
          } else {
            Swal.fire({
              title: 'Echec',
              text: error.statusText,
              icon: 'warning',
              confirmButtonText: 'OK',
              timer: 2000 // Durée en millisecondes (3 secondes dans cet exemple)
            });
            //console.log(error);
          }
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
    this.dialog.open(DisplayRegionComponent,{
      width:'500px',
      data:{
      title: 'Affichage Region',
      id: id  // Pass the id to the dialog
      }
    })
  }
  openPopUp(code: any, title: any,component:any){
    this.dialog.open(AddRegionComponent,{
      width:'500px',
      data:{
        title: 'Ajout Region',
        code: code
      }
    })
  }

}
