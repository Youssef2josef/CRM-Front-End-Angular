import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { RegionService } from 'src/app/services/region.service';
@Component({
  selector: 'app-display-region',
  templateUrl: './display-region.component.html',
  styleUrls: ['./display-region.component.css']
})
export class DisplayRegionComponent implements OnInit {

  inputdata: any;
  displayRegionForm !: FormGroup
  object: any = {}
  id:any;
  findedRegion:any

  constructor(@Inject(MAT_DIALOG_DATA) public data: any, private ref: MatDialogRef<DisplayRegionComponent>, private regionService: RegionService) { }

  ngOnInit() {
    this.inputdata = this.data;
    const id_object = this.data.id;
    this.regionService.getRegionById(id_object).subscribe((res)=>{
      this.findedRegion=res;
    })
  }
  closepopup() {
    this.ref.close('Closed using function');
  }
  

}
