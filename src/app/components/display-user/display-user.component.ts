import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { AgentService } from 'src/app/services/agent.service';

@Component({
  selector: 'app-display-user',
  templateUrl: './display-user.component.html',
  styleUrls: ['./display-user.component.css']
})
export class DisplayUserComponent implements OnInit {
  inputdata: any;
  displayUserForm !: FormGroup
  id:any;
  findedUser:any

  constructor(@Inject(MAT_DIALOG_DATA) public data: any, private ref: MatDialogRef<DisplayUserComponent>, private agentService: AgentService) { }

  ngOnInit() {
    this.inputdata = this.data;
    const id_object = this.data.id;
    this.agentService.getUserById(id_object).subscribe((res)=>{
      this.findedUser=res;
      console.log(this.findedUser);
      
    })
  }
  closepopup() {
    this.ref.close('Closed using function');
  }
  
}
