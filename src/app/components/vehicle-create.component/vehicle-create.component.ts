import { Component, NgZone, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select'; 
import { UserService } from '../../services/user-service/user.service';
import { VehicleService } from '../../services/vehicle-service/vehicle.service';

@Component({
  selector: 'app-vehicle-create',
  templateUrl: './vehicle-create.component.html',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatCardModule, MatButtonModule, MatFormFieldModule, MatInputModule, MatSelectModule, RouterLink]
})
export class VehicleCreateComponent implements OnInit {
  createVehicleForm!: FormGroup;
  submitError = '';
  submitted = false;

  constructor(
    private fb: FormBuilder,
    private vehicleService: VehicleService,
    private userService: UserService,
    private router: Router,
    private ngZone: NgZone
  ) {
    // Szigorú validációs szabályok: a számmezők csak számokat (min 0) fogadnak el
    this.createVehicleForm = this.fb.group({
      vehicleCategory: ['', [Validators.required]],
      type: ['', [Validators.required, Validators.minLength(2)]],
      manufacturer: ['', [Validators.required, Validators.minLength(2)]],
      licensePlate: ['', [Validators.required, Validators.pattern('^[A-Za-z0-9-]+$')]],
      chassisNumber: ['', [Validators.required]],
      serialNumber: ['', [Validators.required, Validators.min(1)]],
      dailyRentalFee: ['', [Validators.required, Validators.min(0)]], 
      perKmFee: ['', [Validators.required, Validators.min(0)]]
    });
  }

  get myForm() { return this.createVehicleForm.controls; }

  ngOnInit(): void {
    if (!this.userService.getCurrentUser()) {
      this.router.navigateByUrl('/login');
    }
  }

  onSubmit(): void {
    this.submitted = true;
    this.submitError = '';

    if (this.createVehicleForm.invalid) {
      this.createVehicleForm.markAllAsTouched();
      return;
    }

    this.vehicleService.createVehicle(this.createVehicleForm.getRawValue()).subscribe({
      next: () => {
        console.log('Jármű rögzítve!');
        this.ngZone.run(() => this.router.navigateByUrl('/vehicles'));
      },
      error: (err) => {
        // Ha a rendszám már létezik, a backend MongoDB unique hibát dob
        this.submitError = 'Hiba a mentés során. Ellenőrizd, hogy a rendszám nem foglalt-e!';
      }
    });
  }
}