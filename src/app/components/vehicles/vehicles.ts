import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { Router } from '@angular/router';
import { UserService } from '../../services/user-service/user.service';

@Component({
  selector: 'app-vehicles',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatButtonModule],
  templateUrl: './vehicles.html', 
  styleUrl: './vehicles.css'      
})
export class VehiclesComponent {
  
  constructor(private userService: UserService, private router: Router) {}

  logout() {
    this.userService.setCurrentUser(null);
    this.router.navigateByUrl('/login');
  }
}