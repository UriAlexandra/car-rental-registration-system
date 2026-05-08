import { Component, NgZone, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { UserService } from '../../services/user-service/user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatCardModule, MatButtonModule, RouterLink ]
})
export class LoginComponent implements OnInit {
  loginForm = new FormGroup({
    username: new FormControl('', [Validators.required]),
    password: new FormControl('', [Validators.required])
  });

  submitError = '';

  constructor(private router: Router, private ngZone: NgZone, private userService: UserService) {}

  ngOnInit(): void {
    // Ha már be vagyunk jelentkezve, egyből irányítsuk át a felhasználót
    if (this.userService.getCurrentUser()) {
      this.router.navigateByUrl('/vehicles'); 
    }
  }

  onSubmit() {
    this.submitError = '';

    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.userService.loginUser(this.loginForm.getRawValue()).subscribe({
      next: (res) => {
        console.log('Sikeres bejelentkezés!');
        // Mentsük el a bejelentkezett felhasználót a localStorage-be
        this.userService.setCurrentUser(res.user);
        
        // Navigálás a járművek oldalra (vagy a dashboardra)
        this.ngZone.run(() => this.router.navigateByUrl('/vehicles'));
      },
      error: (err) => {
        console.log(err);
        // Helytelen adatok esetén hiba kiírása
        this.submitError = err.message ||
          'Hibás felhasználónév vagy jelszó!';
      }
    });
  }
}