import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HomeComponent } from './components/home/home.component';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { SideNavComponent } from './components/side-nav/side-nav.component';
import { LoginComponent } from './components/login/login.component';
import { SignupComponent } from './components/signup/signup.component';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatIconModule} from '@angular/material/icon';
import { MatButtonModule} from '@angular/material/button';
import { MatInputModule} from '@angular/material/input';
import { MatFormFieldModule} from '@angular/material/form-field';
import { MatSelectModule} from '@angular/material/select';
import { ClientsComponent } from './components/clients/clients.component';
import { ObjectsComponent } from './components/objects/objects.component';
import { AgentsComponent } from './components/agents/agents.component';
import { RegionsComponent } from './components/regions/regions.component';
import { ContactComponent } from './components/contact/contact.component';
import { AboutComponent } from './components/about/about.component';
import { ObjectsTableComponent } from './components/objects-table/objects-table.component';
import { MatPaginatorModule} from '@angular/material/paginator';
import { MatPaginator} from '@angular/material/paginator';
import { MatSortModule} from '@angular/material/sort';
import { MatTableModule} from '@angular/material/table';
import { InterceptorService } from './services/interceptor.service';
import { AddObjectComponent } from './components/add-object/add-object.component';
import { AddRegionComponent } from './components/add-region/add-region.component';
import { MatDialogModule } from '@angular/material/dialog';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { EditObjectComponent } from './components/edit-object/edit-object.component';
import { ObjectDataService } from './services/object-data.service';
import { DisplayObjectComponent } from './components/display-object/display-object.component';
import { RegionsTableComponent } from './components/regions-table/regions-table.component';
import { DisplayRegionComponent } from './components/display-region/display-region.component';
import { EditRegionComponent } from './components/edit-region/edit-region.component';
import { RegionDataService } from './services/region-data.service';
import { ClientsTableComponent } from './components/clients-table/clients-table.component';
import { AddClientComponent } from './components/add-client/add-client.component';
import { EditClientComponent } from './components/edit-client/edit-client.component';
import { DisplayClientComponent } from './components/display-client/display-client.component';
import { ClientDataService } from './services/client-data.service';
import { AgentsTableComponent } from './components/agents-table/agents-table.component';
import { DisplayUserComponent } from './components/display-user/display-user.component';
import { EditUserComponent } from './components/edit-user/edit-user.component';
import { AddUserComponent } from './components/add-user/add-user.component';
import { AgentDataService } from './services/agent-data.service';
import { SettingsComponent } from './components/settings/settings.component';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatNativeDateModule } from '@angular/material/core';
import { ResponsablesComponent } from './components/responsables/responsables.component';
import { ResponsablesTableComponent } from './components/responsables-table/responsables-table.component';
import { SignupAdminComponent } from './components/signup-admin/signup-admin.component';
import { SignupResponsableComponent } from './components/signup-responsable/signup-responsable.component';
import { SuiviRapportsComponent } from './components/suivi-rapports/suivi-rapports.component';
import { EnsembleRapportsComponent } from './components/ensemble-rapports/ensemble-rapports.component';
import { MatRadioModule } from '@angular/material/radio';
import { AddRapportComponent } from './components/add-rapport/add-rapport.component';
import { EditRapportComponent } from './components/edit-rapport/edit-rapport.component';
import { DisplayRapportComponent } from './components/display-rapport/display-rapport.component';
import { RapportDataService } from './services/rapport-data.service';
import { TextFieldModule } from '@angular/cdk/text-field';



@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    HeaderComponent,
    FooterComponent,
    SideNavComponent,
    LoginComponent,
    SignupComponent,
    ClientsComponent,
    ObjectsComponent,
    AgentsComponent,
    RegionsComponent,
    ContactComponent,
    AboutComponent,
    ObjectsTableComponent,
    AddObjectComponent,
    AddRegionComponent,
    EditObjectComponent,
    DisplayObjectComponent,
    RegionsTableComponent,
    DisplayRegionComponent,
    EditRegionComponent,
    ClientsTableComponent,
    AddClientComponent,
    EditClientComponent,
    DisplayClientComponent,
    AgentsTableComponent,
    DisplayUserComponent,
    EditUserComponent,
    AddUserComponent,
    SettingsComponent,
    ResponsablesComponent,
    ResponsablesTableComponent,
    SignupAdminComponent,
    SignupResponsableComponent,
    SuiviRapportsComponent,
    EnsembleRapportsComponent,
    AddRapportComponent,
    EditRapportComponent,
    DisplayRapportComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    FormsModule,//here TDF Module
    ReactiveFormsModule,//here RF module
    HttpClientModule,
    MatFormFieldModule, 
    MatInputModule, 
    MatButtonModule, 
    MatIconModule,
    MatSelectModule,
    MatPaginatorModule,
    MatSortModule,
    MatTableModule,
    MatDialogModule,
    MatCheckboxModule,
    MatExpansionModule,
    MatNativeDateModule,
    MatDatepickerModule,
    MatRadioModule,
    TextFieldModule
  ],
  providers : [  { provide: HTTP_INTERCEPTORS, useClass: InterceptorService, multi: true },ObjectDataService,RegionDataService,ClientDataService,AgentDataService,RapportDataService],
  entryComponents: [AddObjectComponent,EditObjectComponent,DisplayObjectComponent,
  AddRegionComponent,EditRegionComponent,DisplayRegionComponent,
  AddClientComponent,EditClientComponent,DisplayClientComponent,
  AddUserComponent,EditUserComponent,DisplayUserComponent,
  AddRapportComponent,EditRapportComponent,DisplayRapportComponent],
  bootstrap: [AppComponent]
})
export class AppModule { }
