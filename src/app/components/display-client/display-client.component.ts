import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ClientService } from 'src/app/services/client.service';

@Component({
  selector: 'app-display-client',
  templateUrl: './display-client.component.html',
  styleUrls: ['./display-client.component.css']
})
export class DisplayClientComponent implements OnInit {
  inputdata: any;
  displayClientForm !: FormGroup
  id:any;
  findedClient:any

  constructor(@Inject(MAT_DIALOG_DATA) public data: any, private ref: MatDialogRef<DisplayClientComponent>, private clientService: ClientService) { }

  ngOnInit() {
    this.inputdata = this.data;
    const id_object = this.data.id;
    this.clientService.getClientById(id_object).subscribe((res)=>{
      this.findedClient=res;
    })
  }
  closepopup() {
    this.ref.close('Closed using function');
  }
  
}
