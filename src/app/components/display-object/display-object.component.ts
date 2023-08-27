import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ObjectService } from 'src/app/services/object.service';


@Component({
  selector: 'app-display-object',
  templateUrl: './display-object.component.html',
  styleUrls: ['./display-object.component.css']
})
export class DisplayObjectComponent implements OnInit {
  inputdata: any;
  displayObjectForm !: FormGroup
  object: any = {}
  id:any;
  findedObject:any

  constructor(@Inject(MAT_DIALOG_DATA) public data: any, private ref: MatDialogRef<DisplayObjectComponent>, private objectService: ObjectService) { }

  ngOnInit() {
    this.inputdata = this.data;
    const id_object = this.data.id;
    this.objectService.getObjectById(id_object).subscribe((res)=>{
      this.findedObject=res;
    })
  }
  closepopup() {
    this.ref.close('Closed using function');
  }
  
}
