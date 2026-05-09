import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { Router, RouterLink } from '@angular/router'; // ✅ RouterLinkActive törölve
import { UserService } from '../../services/user-service/user.service';
import { VehicleService } from '../../services/vehicle-service/vehicle.service';

@Component({
  selector: 'app-vehicles',
  templateUrl: './vehicles-list.component.html',
  styleUrl: './vehicles-list.component.css',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatButtonModule, RouterLink] // ✅ RouterLinkActive törölve
})
export class VehiclesComponent implements OnInit {
  vehicles: any[] = [];
  loadError = '';

  constructor(
    private router: Router,
    private vehicleService: VehicleService,
    private userService: UserService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    if (!this.userService.getCurrentUser()) {
      this.router.navigate(['/login']);
      return;
    }
    this.readVehicles();
  }

  readVehicles() {
    this.loadError = '';
    this.vehicleService.getVehicles().subscribe({
      next: (data) => {
        this.vehicles = data;
        this.cdr.detectChanges();
      },
      error: () => {
        this.loadError = 'Nem sikerült betölteni a járműveket.';
        this.cdr.detectChanges();
      }
    });
  }

  logout() {
    this.userService.setCurrentUser(null);
    this.router.navigateByUrl('/login');
  }
}