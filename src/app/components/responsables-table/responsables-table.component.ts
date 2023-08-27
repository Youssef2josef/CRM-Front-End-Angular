import { Router } from '@angular/router';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';

import { AgentService } from 'src/app/services/agent.service';
import { AgentDataService } from 'src/app/services/agent-data.service';
import { DisplayUserComponent } from '../display-user/display-user.component';
import Swal from 'sweetalert2';


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
  selector: 'app-responsables-table',
  templateUrl: './responsables-table.component.html',
  styleUrls: ['./responsables-table.component.css']
})
export class ResponsablesTableComponent implements OnInit {
  users: UserData[] = []; // Initialize an empty array for users

  displayedColumns: string[] = ['id', 'firstName', 'lastName', 'email', 'regionNom','role', 'actions'];
  dataSource: MatTableDataSource<UserData>;

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  addingSectionVisible: boolean;
  role:string='';

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
        this.applyRoleFilter(); // Apply role-based filter after fetching all users
      },
      (error) => {
        //console.error('Error fetching users:', error);
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
    const filteredUsers = this.users.filter(user => !this.checkUserRole(user));
    this.dataSource.data = filteredUsers;
    this.dataSource.paginator.length = filteredUsers.length; // Set the paginator length to the count of filtered users
  }


  viewDetails(id: any) {
    // Implement view details logic here
    this.dialog.open(DisplayUserComponent, {
      width: '500px',
      data: {
        title: 'Affichage Super Utilisateur',
        id: id  // Pass the id to the dialog
      }
    })
  }
  
  checkUserRole(row: UserData): boolean {
    // Convert the roles Set to an array and then check for 'ROLE_AGENT'
    return Array.from(row.roles).some(role => role.name === 'ROLE_AGENT');
  }
  
  checkAuthentification(){
    if(sessionStorage.getItem("auth-user")!=null){
      this.role = JSON.parse(sessionStorage.getItem("auth-user")).roles[0];
      if(this.role=="ROLE_ADMIN" || this.role=="ROLE_RESPONSABLE"){
      this.addingSectionVisible=true;
      }
      else{
      this.addingSectionVisible=false;
      } 
    }
    else{
      console.log("Non authentifié");
    }
  }
}
