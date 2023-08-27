import { HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Component, OnInit, Inject, NgZone, ViewChild } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ClientService } from 'src/app/services/client.service';
import { ObjectService } from 'src/app/services/object.service';
import { RapportDataService } from 'src/app/services/rapport-data.service';
import { RapportService } from 'src/app/services/rapport.service';
import { RegionService } from 'src/app/services/region.service';
import Swal from 'sweetalert2';
import { CdkTextareaAutosize } from '@angular/cdk/text-field';
import { take } from 'rxjs/operators';


function forbiddenNullValue(control: AbstractControl) {
  if (control.value === 'null') {
    return { forbiddenNullValue: true };
  }
  return null;
}

@Component({
  selector: 'app-add-rapport',
  templateUrl: './add-rapport.component.html',
  styleUrls: ['./add-rapport.component.css']
})
export class AddRapportComponent implements OnInit {
  authUserEmail = JSON.parse(sessionStorage.getItem("auth-user")).email;

  inputdata: any;
  regions: any;
  objects: any;
  clients: any;

  multiStep =  new FormGroup({    
    text:new FormControl(''),
    userEmail: new FormControl(this.authUserEmail),
    objectNom: new FormControl('null',forbiddenNullValue),
    regionNom: new FormControl('null',forbiddenNullValue),
    clientNom: new FormControl('null',forbiddenNullValue),
    date: new FormControl(this.getCurrentDate(),forbiddenNullValue),
  })
  constructor(@Inject(MAT_DIALOG_DATA) public data: any, private ref: MatDialogRef<AddRapportComponent>, private router: Router, private rapportService: RapportService, private rapportDataService: RapportDataService,private regionService:RegionService,
  private objectService:ObjectService,private clientService:ClientService,private _ngZone: NgZone) { }
  @ViewChild('autosize', {static: false}) autosize: CdkTextareaAutosize;

  triggerResize() {
    // Wait for changes to be applied, then trigger textarea resize.
    this._ngZone.onStable.pipe(take(1))
        .subscribe(() => this.autosize.resizeToFitContent(true));
  }
  
  ngOnInit() {
    this.inputdata = this.data;
    this.getAllRegion();
    this.getAllObject();
    this.getAllClient();
  }

  getCurrentDate(): string {
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = ('0' + (currentDate.getMonth() + 1)).slice(-2);
    const day = ('0' + currentDate.getDate()).slice(-2);
    return `${year}-${month}-${day}`;
  }

  
  getAllRegion() {
    this.regionService.getAllRegions().subscribe(
      (data) => {
        this.regions = data;
        //console.log("x");
      },
      (error) => {
        console.error('Error fetching regions:', error);
      }
    );
  }

  getAllObject() {
    this.objectService.getAllObjects().subscribe(
      (data) => {
        this.objects = data;
        //console.log("x");
      },
      (error) => {
        console.error('Error fetching Objects:', error);
      }
    );
  }

  getAllClient() {
    this.clientService.getAllClients().subscribe(
      (data) => {
        this.clients = data;
        //console.log("x");
      },
      (error) => {
        console.error('Error fetching Clients:', error);
      }
    );
  }

  changeRegion(selectedRegion:string){
    console.log(selectedRegion);
  }

  changeObject(selectedObject:string){
    console.log(selectedObject);
  }

  changeClient(selectedClient:string){
    console.log(selectedClient);
  }

  closepopup() {
    this.ref.close('Closed using function');
  }

  getRegionErrorMessage() {
    const regionControl = this.multiStep.get('regionNom');
    if (regionControl.hasError('forbiddenNullValue')) {
      return 'Sélection invalide.';
    }
    return '';
  }
  getObjectErrorMessage() {
    const regionControl = this.multiStep.get('objectNom');
    if (regionControl.hasError('forbiddenNullValue')) {
      return 'Sélection invalide.';
    }
    return '';
  }
  getClientErrorMessage() {
    const regionControl = this.multiStep.get('clientNom');
    if (regionControl.hasError('forbiddenNullValue')) {
      return 'Sélection invalide.';
    }
    return '';
  }
  addRapport(){
    if (this.multiStep.get('text').value=='null' || this.multiStep.get('userEmail').value =='null' ||this.multiStep.get('regionNom').value =='null' || this.multiStep.get('objectNom').value =='null' || this.multiStep.get('clientNom').value =='null' || this.multiStep.get('date').value =='null') {
      Swal.fire({
        title: 'Erreur de remplissage',
        text: 'Tous les champs sont necessaires',
        icon: 'error',
        confirmButtonText: 'OK',
        timer: 2000 // Durée en millisecondes (3 secondes dans cet exemple)
      });
      return;
    }
    const requestPayload = {
      text: this.multiStep.get('text').value,
      userEmail: this.multiStep.get('userEmail').value,
      regionNom: this.multiStep.get('regionNom').value,
      objectNom: this.multiStep.get('objectNom').value,
      clientNom: this.multiStep.get('clientNom').value,
      date: this.multiStep.get('date').value,
    };
    console.log("here ****", requestPayload);

    this.rapportService.addRapport(requestPayload).subscribe((res) => {
      console.log("here response from BE", res);
      Swal.fire({
        title: 'Excellent',
        text: 'Rapport Ajouté Bien Réussi',
        icon: 'success',
        confirmButtonText: 'OK',
        timer: 2000 // Durée en millisecondes (3 secondes dans cet exemple)
      });
      // Trigger data refresh in ClientsTableComponent
      this.rapportDataService.triggerRefreshRapports();
      this.router.navigate(['/Dashboard']);
      this.closepopup();
    },
    (error: HttpErrorResponse) => {
      // Traitement en cas d'erreur
      if (error.error && error.error.message) {
        Swal.fire({
          title: 'Echec', 
          text: error.error.message,
          icon: 'warning',
          confirmButtonText: 'OK',
          timer: 2000 // Durée en millisecondes (3 secondes dans cet exemple)
        });
        console.log(error);
        
      } else {
        Swal.fire({
          title: 'Echec', 
          text: error.statusText,
          icon: 'warning',
          confirmButtonText: 'OK',
          timer: 2000 // Durée en millisecondes (3 secondes dans cet exemple)
        });
        console.log(error);
        
      }
    });
  }
}
