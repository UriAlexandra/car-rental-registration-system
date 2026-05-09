import { Component, NgZone, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormGroupDirective, NgForm, ReactiveFormsModule, Validators } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { ActivatedRoute, Router, RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';

import { VehicleService } from '../../services/vehicle-service/vehicle.service';
import { UserService } from '../../services/user-service/user.service';

export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}

@Component({
  selector: 'app-vehicle-edit',
  templateUrl: './vehicle-edit.component.html',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink,
    RouterLinkActive,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule
  ]
})
export class VehicleEditComponent implements OnInit {
  vehicleId = '';
  submitError = '';
  submitted = false;
  editVehicleForm!: FormGroup;
  matcher = new MyErrorStateMatcher();

  constructor(
    private formBuilder: FormBuilder,
    private vehicleService: VehicleService,
    private userService: UserService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private ngZone: NgZone
  ) {
    this.mainForm();
  }

  get myForm() {
    return this.editVehicleForm.controls;
  }

  ngOnInit(): void {
    if (!this.getUser()) {
      return;
    }

    this.vehicleId = this.activatedRoute.snapshot.paramMap.get('id') ?? '';
    if (!this.vehicleId) {
      this.router.navigateByUrl('/vehicles');
      return;
    }

    this.vehicleService.getVehicle(this.vehicleId).subscribe((vehicle) => {
      this.editVehicleForm.patchValue(vehicle);
    });
  }

  mainForm() {
    this.editVehicleForm = this.formBuilder.group({
      vehicleCategory: ['', [Validators.required]],
      type:            ['', [Validators.required, Validators.minLength(2)]],
      manufacturer:    ['', [Validators.required, Validators.minLength(2)]],
      licensePlate:    ['', [Validators.required, Validators.pattern('^[A-Za-z0-9-]+$')]],
      chassisNumber:   ['', [Validators.required]],
      serialNumber:    ['', [Validators.required, Validators.min(1)]],
      dailyRentalFee:  ['', [Validators.required, Validators.min(0)]],
      perKmFee:        ['', [Validators.required, Validators.min(0)]],
      status:          ['', [Validators.required]]
    });
  }

  onSubmit(): void {
    this.submitted = true;
    this.submitError = '';
    
    if (!this.editVehicleForm.valid) {
      this.editVehicleForm.markAllAsTouched();
      return;
    }

    this.vehicleService.updateVehicle(this.vehicleId, this.editVehicleForm.getRawValue()).subscribe(
      () => {
        console.log('Vehicle successfully updated!');
        this.ngZone.run(() => this.router.navigateByUrl('/vehicles'));
      }, (error) => {
        console.log(error);
        this.submitError = 'Vehicle could not be updated.';
      }
    );
  }

  getUser(): boolean {
    if (!this.userService.getCurrentUser()) {
      this.router.navigateByUrl('/login');
      return false;
    }
    return true;
  }
}