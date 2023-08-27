import { Component, OnInit, Inject, NgZone, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { RapportService } from 'src/app/services/rapport.service';
import {CdkTextareaAutosize, TextFieldModule} from '@angular/cdk/text-field';
import {take} from 'rxjs/operators';

@Component({
  selector: 'app-display-rapport',
  templateUrl: './display-rapport.component.html',
  styleUrls: ['./display-rapport.component.css']
})
export class DisplayRapportComponent implements OnInit {

  inputdata: any;
  displayRapportForm !: FormGroup
  findedRapport:any

  constructor(@Inject(MAT_DIALOG_DATA) public data: any, private ref: MatDialogRef<DisplayRapportComponent>, private rapportService: RapportService,private _ngZone: NgZone) { }

  @ViewChild('autosize',{static:true}) autosize: CdkTextareaAutosize;

  ngOnInit() {
    this.inputdata = this.data;
    this.rapportService.getRapportById(this.data.id).subscribe((res)=>{
      this.findedRapport=res;
    })
  }
  closepopup() {
    this.ref.close('Closed using function');
  }
  triggerResize() {
    // Wait for changes to be applied, then trigger textarea resize.
    this._ngZone.onStable.pipe(take(1)).subscribe(() => this.autosize.resizeToFitContent(true));
  }
}
