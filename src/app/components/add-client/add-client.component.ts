import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ClientDataService } from 'src/app/services/client-data.service';
import { ClientService } from 'src/app/services/client.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-add-client',
  templateUrl: './add-client.component.html',
  styleUrls: ['./add-client.component.css']
})
export class AddClientComponent implements OnInit {
  inputdata: any;
  addClientForm !: FormGroup
  client: any = {}
  constructor(@Inject(MAT_DIALOG_DATA) public data: any, private ref: MatDialogRef<AddClientComponent>, private router: Router, private clientService: ClientService, private clientDataService: ClientDataService) { }

  ngOnInit() {
    this.inputdata = this.data;
  }
  closepopup() {
    this.ref.close('Closed using function');
  }
  addClient() {
    console.log("here ****", this.client.name);
    if (!this.client.name || !this.client.mail) {
      Swal.fire({
        title: 'Erreur de remplissage',
        text: 'Champ Nom et Mail sont necessaires',
        icon: 'error',
        confirmButtonText: 'OK',
        timer: 2000 // Durée en millisecondes (3 secondes dans cet exemple)

      });
      return; // Stop the function execution if the nom field is empty
    }
    this.clientService.addClient(this.client).subscribe((res) => {
      console.log("here response from BE", res);
      Swal.fire({
        title: 'Excellent',
        text: 'Client Ajouté Bien Réussi',
        icon: 'success',
        confirmButtonText: 'OK',
        timer: 2000 // Durée en millisecondes (3 secondes dans cet exemple)
      });
      // Trigger data refresh in ClientsTableComponent
      this.clientDataService.triggerRefreshClients();
      this.router.navigate(['/Clients']);
      this.closepopup();
    });
  }

}
