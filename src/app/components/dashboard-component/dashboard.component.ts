import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user-service/user.service';
import { User } from '../../models/user';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-dashboard.component',
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
  imports: [
    CommonModule,
    RouterLink,
    RouterLinkActive,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule
  ]
})
export class DashboardComponent implements OnInit {
  user = new User();
  username!: string;
  name!: string;

  constructor(private userService: UserService, private router: Router) { }

  ngOnInit(): void {
    this.getUser();
  }

  getUser(): void {
    const currentUser = this.userService.getCurrentUser();
    if (!currentUser) {
      this.router.navigate(['/login']);
      return;
    }

    this.user = currentUser;
    this.name = JSON.stringify(this.user.name);
    this.username = JSON.stringify(this.user.username);
  }

  logout(): void {
    this.user = new User();
    this.userService.setCurrentUser(null);
    this.router.navigate(['/login']);
  }
}
