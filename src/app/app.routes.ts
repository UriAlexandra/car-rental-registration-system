import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { DashboardComponent } from './components/dashboard-component/dashboard.component';
import { LoginComponent } from './components/login-component/login.component';
import { RegistrationComponent } from './components/registration-component/registration.component';
import { VehiclesComponent } from './components/vehicles/vehicles';

export const routes: Routes = [
{ path: '', pathMatch: 'full', redirectTo: 'login' },
{ path: 'dashboard', component: DashboardComponent },
{ path: 'login', component: LoginComponent },
{ path: 'registration', component: RegistrationComponent },
{ path: 'vehicles', component: VehiclesComponent },
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }