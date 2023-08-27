import { animate, style, transition, trigger } from '@angular/animations';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from 'src/app/services/user.service';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { TokenStorageService } from 'src/app/services/token-storage.service';
import { HttpErrorResponse } from '@angular/common/http';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
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
export class LoginComponent implements OnInit {
  loginForm !: FormGroup
  u: any;
  roles: any = [];
  title = 'Connexion'
  isLoginFailed: boolean;
  isLoggedIn: boolean
  messageErreur: any;
  name: any;
  hide = true;
  eyeOpen: any = '<i class="fa-solid fa-eye"></i>'
  eyeSlash: any = '<i class="fa-solid fa-eye-slash"></i>';

  constructor(private formBuilder: FormBuilder,
    private router: Router, private userService: UserService,
    private tokenStorage: TokenStorageService) { }

  ngOnInit(): void {
    this.loginForm = this.formBuilder.group({
      email: ["", [Validators.email, Validators.required]],
      password: ["", [Validators.minLength(3), Validators.required]],
    })
  }
  login() {
    this.u = this.loginForm.value;
    //console.log("here user", this.u)
    this.userService.login(this.u).subscribe((data) => {
      this.tokenStorage.saveToken(data.accessToken);
      this.tokenStorage.saveUser(data);
      this.isLoginFailed = false;
      this.isLoggedIn = true;
      this.roles = this.tokenStorage.getUser().roles;
      this.name = JSON.parse(sessionStorage.getItem("auth-user")).firstName;

      this.router.navigate(["Dashboard"]);
      Swal.fire({
        title: 'Authentifié',
        text: 'Bienvenue cher ' + data.firstName,
        icon: 'success',
        confirmButtonText: 'OK',
        timer: 2000

      });
      //console.log(data);
    }, (error: HttpErrorResponse) => {
      if (error.error && error.error.message) {
        this.messageErreur = "Erreur lors de l'authentification : Veuillez Essayer de nouveau";
        Swal.fire({
          title: 'Erreur d\'authentification',
          text: 'Veuillez Essayer de nouveau',
          icon: 'error',
          confirmButtonText: 'OK',
          timer: 2000

        });
      } else if (error.status === 401 && error.error === 'Bad credentials') {
        this.messageErreur = "Erreur d'authentification : Mauvaises informations d'identification.";
        // Show SweetAlert2 error popup
        Swal.fire({
          title: 'Erreur d\'authentification',
          text: 'Mauvaises informations d\'identification',
          icon: 'error',
          confirmButtonText: 'OK',
          timer: 2000
        });
      } else {
        this.messageErreur = "Erreur lors de l'authentification : " + error.statusText;
      }
      console.log(error);
    })
  }

}