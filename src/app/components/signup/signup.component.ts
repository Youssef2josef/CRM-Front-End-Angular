import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators,AbstractControl  } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from 'src/app/services/user.service';
import { animate, style, transition, trigger } from '@angular/animations';
import { MustMatch } from '../confirmPwd';
import { RegionService } from 'src/app/services/region.service';
import { HttpErrorResponse } from '@angular/common/http';
import Swal from 'sweetalert2';

function forbiddenNullValue(control: AbstractControl) {
  if (control.value === 'null') {
    return { forbiddenNullValue: true };
  }
  return null;
}

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css'],
  animations: [
    trigger('fadeInSpan', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('2s', style({ opacity: 1 })),
      ]),
    ]),
    trigger('inputBoxAnimation', [
      transition('* => focusValid', [
        style({

        }),
        animate('1s', style({
          color: '#45f3ff',
          transform: 'translateX(-10px) translateY(-30px)',
          fontSize: '0.75em',
        })),
      ]),
    ]),
    trigger('inputIAnimation', [
      transition('* => focusValid', [
        style({

        }),
        animate('1s', style({
          height: '44px',
        })),
      ]),
    ]),
  ],
})
export class SignupComponent implements OnInit {

  regions: any =[];
  titleOne = 'Info Utilisateur ';
  titleTwo = 'Info Compte ';
  titleThree = 'Info Region ';
  step:any=1;
  submitted: any = false;
  data:any;
  messageErreur:any;
  roles: any = [];
  multiStep =  new FormGroup({
      firstName: new FormControl('',[Validators.minLength(3), Validators.required]),
      lastName: new FormControl('',[Validators.minLength(3), Validators.required]),

      email: new FormControl('',[Validators.email, Validators.required]),
      password: new FormControl('',[Validators.minLength(6),Validators.maxLength(40), Validators.required, Validators.pattern(/^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/)]),

      region: new FormControl('null',forbiddenNullValue),
      roles: new FormControl(['agent'])
  })

  constructor(private formBuilder: FormBuilder,
    private router: Router, private userService: UserService,private regionService:RegionService) { }

  ngOnInit(): void {
    this.getAllRegion();
  }
  getAllRegion() {
    this.regionService.getAllRegions().subscribe(
      (data) => {
        this.regions = data;
        console.log("x");
      },
      (error) => {
        console.error('Error fetching regions:', error);
      }
    );
  }
  changeRegion(e){
    console.log(e.target.value);
  }
  next(){
    this.submitted=true;
    if((this.multiStep.controls['firstName'].invalid || this.multiStep.controls['lastName'].invalid) && this.step==1 ){
      Swal.fire({
        title: 'Erreur de remplissage',
        text: 'Tous les champs sont necessaires',
        icon: 'error',
        confirmButtonText: 'OK',
        timer: 2000

      });
      return;
    }
    if((this.multiStep.controls['email'].invalid || this.multiStep.controls['password'].invalid) && this.step==2 ){
      console.log("ddd");
      Swal.fire({
        title: 'Erreur de remplissage',
        text: 'Tous les champs sont necessaires',
        icon: 'error',
        confirmButtonText: 'OK',
        timer: 2000

      });
      return;
    }
    this.step = this.step + 1;
  }
  previous(){
    this.step = this.step - 1;
  }
  signUp() {
    if(this.multiStep.get('region').value =='null'  && this.step==3 ){
      console.log("ddd");
      Swal.fire({
        title: 'Erreur de remplissage',
        text: 'Veuillez Choisir Un option',
        icon: 'error',
        confirmButtonText: 'OK',
        timer: 2000

      });
      return;
    }
    //console.log(this.multiStep.value);
    this.userService.signup(this.multiStep.value).subscribe((data)=>{
      this.router.navigate([""]);
    },
    (error: HttpErrorResponse) => {
      // Traitement en cas d'erreur
      if (error.error && error.error.message) {
        Swal.fire({
          title: 'Echec',
          text: error.error.message,
          icon: 'error',
          confirmButtonText: 'OK',
          timer: 2000
        });
      } else {
        this.messageErreur="Erreur fatale";
        Swal.fire({
          title: 'Echec',
          text: this.messageErreur,
          icon: 'error',
          confirmButtonText: 'OK',
          timer: 2000
        });
      }
    })
  }
  getPasswordErrorMessage() {
    const passwordControl = this.multiStep.get('password');
    const errors = passwordControl.errors;
    if(errors!=null){
    if (errors.required) {
      return 'Le mot de passe est requis.';
    }
    if (errors.minlength) {
      return 'Le mot de passe doit avoir au moins 6 caractères.';
    }
    if (errors.maxlength) {
      return 'Le mot de passe doit avoir au max 40 caractères.';
    }
    if (errors.pattern) {
      let message = '';

      if (!/(?=.*[A-Z])/.test(passwordControl.value)) {
        message += 'Ajoutez une lettre majuscule. ';
      }
      if (!/(?=.*\d)/.test(passwordControl.value)) {
        message += 'Ajoutez un chiffre. ';
      }
      if (!/(?=.*[@$!%*?&])/.test(passwordControl.value)) {
        message += 'Ajoutez un symbole.';
      }

      return message;
    }
    }
    return '';
  }
  getRegionErrorMessage() {
    const regionControl = this.multiStep.get('region');
    if (regionControl.hasError('forbiddenNullValue')) {
      return 'Sélection invalide.';
    }
    return '';
  }
  go(){
    this.router.navigate([""]);
  }
}
