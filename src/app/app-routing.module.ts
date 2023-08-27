import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';
import { SignupComponent } from './components/signup/signup.component';
import { ObjectsComponent } from './components/objects/objects.component';
import { RegionsComponent } from './components/regions/regions.component';
import { ClientsComponent } from './components/clients/clients.component';
import { AgentsComponent } from './components/agents/agents.component';
import { ContactComponent } from './components/contact/contact.component';
import { AboutComponent } from './components/about/about.component';
import { EditObjectComponent } from './components/edit-object/edit-object.component';
import { SettingsComponent } from './components/settings/settings.component';
import { ResponsablesComponent } from './components/responsables/responsables.component';
import { SignupAdminComponent } from './components/signup-admin/signup-admin.component';
import { SignupResponsableComponent } from './components/signup-responsable/signup-responsable.component';


const routes: Routes = [
  {path:"",component:LoginComponent},
  {path:"register",component:SignupComponent},
  {path:"register/Admin",component:SignupAdminComponent},
  {path:"register/Responsable",component:SignupResponsableComponent},

  {path:"Dashboard",component:HomeComponent},
  {path:"Regions",component:RegionsComponent},
  {path:"Objects",component:ObjectsComponent},
  {path:"Agents",component:AgentsComponent},
  {path:"Clients",component:ClientsComponent},
  {path:"Contact",component:ContactComponent},
  {path:"About",component:AboutComponent},
  {path:"Settings",component:SettingsComponent},
  {path:"Responsables",component:ResponsablesComponent},

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
