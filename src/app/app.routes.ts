import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { DashboardComponent }     from './components/dashboard-component/dashboard.component';
import { LoginComponent }         from './components/login-component/login.component';
import { RegistrationComponent }  from './components/registration-component/registration.component';
import { VehiclesComponent }      from './components/vehicles-list.component/vehicles-list.component';
import { VehicleCreateComponent } from './components/vehicle-create.component/vehicle-create.component';
import { VehicleEditComponent }   from './components/vehicle-edit.component/vehicle-edit.component';

export const routes: Routes = [
  { path: '',                   pathMatch: 'full', redirectTo: 'login' },
  { path: 'login',              component: LoginComponent },
  { path: 'registration',       component: RegistrationComponent },
  { path: 'dashboard',          component: DashboardComponent },
  { path: 'vehicles',           component: VehiclesComponent },
  { path: 'vehicle-create',     component: VehicleCreateComponent },
  { path: 'vehicle-edit/:id',   component: VehicleEditComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }