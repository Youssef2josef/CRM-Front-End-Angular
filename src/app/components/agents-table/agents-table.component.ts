import { Router } from '@angular/router';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';


import Swal from 'sweetalert2';
import { AgentService } from 'src/app/services/agent.service';
import { AgentDataService } from 'src/app/services/agent-data.service';
import { EditUserComponent } from '../edit-user/edit-user.component';
import { AddUserComponent } from '../add-user/add-user.component';
import { DisplayUserComponent } from '../display-user/display-user.component';


export interface UserData {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  region: {
    nom: string;
  };
  roles: {
    name: string;
  }[];

}


@Component({
  selector: 'app-agents-table',
  templateUrl: './agents-table.component.html',
  styleUrls: ['./agents-table.component.css']
})
export class AgentsTableComponent implements OnInit {
  users: UserData[] = []; // Initialize an empty array for users

  displayedColumns: string[] = ['id', 'firstName', 'lastName', 'email', 'regionNom', 'role', 'actions', 'add'];
  dataSource: MatTableDataSource<UserData>;

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  addingSectionVisible: boolean;
  role: string = '';

  constructor(private agentService: AgentService, private dialog: MatDialog, private router: Router, private agentDataService: AgentDataService) {
    this.dataSource = new MatTableDataSource(this.users);
    this.agentDataService.refreshUsers$.subscribe(() => {
      this.getAllUsers();
    });

  }

  ngOnInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.getAllUsers();

    this.checkAuthentification();
    //console.log(this.addingSectionVisible);
  }

  getAllUsers() {
    this.agentService.getAllUsers().subscribe(
      (data: UserData[]) => {
        this.users = data;
        //console.log(data);
        this.applyRoleFilter(); // Apply role-based filter after fetching all users
      },
      (error) => {
       // console.error('Error fetching users:', error);
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
        else if (error.message=="Http failure response for http://localhost:8086/api/agents: 401 OK") {
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

    this.applyRoleFilter(); // Apply role-based filter after applying user filter
  }

  applyRoleFilter() {
    const filteredUsers = this.users.filter(user => this.checkUserRole(user));
    this.dataSource.data = filteredUsers;
    this.dataSource.paginator.length = filteredUsers.length; // Set the paginator length to the count of filtered users
  }

  editRow(id: any) {
    // Implement edit logic here
    this.dialog.open(EditUserComponent, {
      width: '500px',
      data: {
        title: 'Edit Utilisateur',
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
        this.agentService.deleteUserById(id).subscribe((res) => {
          console.log("Deleted:", res);
          // Refresh the user list after deletion
          this.getAllUsers();
          // Navigate to the Users route
          this.router.navigate(['/Users']);
        });

        swalWithBootstrapButtons.fire(
          'Excellent!',
          'User a été supprimé avec succés . Raifraichir la page',
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
    this.dialog.open(DisplayUserComponent, {
      width: '500px',
      data: {
        title: 'Affichage Utilisateur',
        id: id  // Pass the id to the dialog
      }
    })
  }

  openPopUp() {
    this.dialog.open(AddUserComponent, {
      width: '500px',
      data: {
        title: 'Ajout Utilisateur',
      }
    })
  }

  checkUserRole(row: UserData): boolean {
    // Convert the roles Set to an array and then check for 'ROLE_AGENT'
    return Array.from(row.roles).some(role => role.name === 'ROLE_AGENT');
  }

  checkAuthentification() {
    if (sessionStorage.getItem("auth-user") != null) {
      this.role = JSON.parse(sessionStorage.getItem("auth-user")).roles[0];
      if (this.role == "ROLE_ADMIN" || this.role == "ROLE_RESPONSABLE") {
        this.addingSectionVisible = true;
      }
      else {
        this.addingSectionVisible = false;
      }
    }
    else {
      console.log("Non authentifié");
    }
  }

}

